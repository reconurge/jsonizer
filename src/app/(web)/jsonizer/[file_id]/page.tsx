"use client"
import React from 'react'
import Flow from '@/components/viewers/flow'
import { flowlize } from '@/lib/flowlize'
import { useDropzoneContext } from '@/components/dropzone/dropzone-provider'
import { useParams } from 'next/navigation'
import { useQueryState } from 'nuqs'
import ObjectViewer from '@/components/viewers/object-viewer'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const Page = () => {
    const { fileContents, isDragActive, isDragAccept, isDragReject } = useDropzoneContext()
    const [view, setView] = useQueryState("view", { defaultValue: "flow" })
    const { file_id } = useParams()
    const file = React.useMemo(() => fileContents.find((file) => file.id === file_id), [fileContents, file_id]);
    if (!file) return <div className={cn('h-full w-full p-24 flex flex-col items-center justify-center')}>
        <div className={cn('h-full border-4 border-dotted overflow-hidden relative w-full rounded-xl flex flex-col items-center justify-center', isDragActive && !isDragReject ? "border-primary" : isDragReject && "border-destructive")}>
            <span className='text-5xl font-bold'>404</span><span className='text-xl italic text-primary/60'>Not found</span>
            <span className='mt-4'>Could not find the json document with id:</span>
            <span className='border border-primary-80 bg-primary/30 text-primary rounded-full px-2 my-2'>{JSON.stringify(file_id)}</span>
            <p className='mt-4 text-center font-semibold'>Drag and drop your JSON files here to visalize their contents.</p>
            <p className='opacity-60'>Don&apos;t worry, none of it is stored anywhere, except your browser&apos;s localStorage.</p>
            <div className={cn('absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm duration-300', isDragActive && !isDragReject ? "opacity-100" : "opacity-0")}>
                <span className='text-xl font-semibold'> Oh ! Drop it, let&apos;s see it !</span>
            </div>
            {isDragAccept &&
                <div className={cn('absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm duration-300')}>
                    <span className='text-xl font-semibold'>Let's extract it...</span>
                </div>}
            {isDragReject &&
                <div className={cn('absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm duration-300')}>
                    <span className='text-xl font-semibold'>Woho. That's <span className='border border-destructive-80 bg-destructive/30 text-destructive rounded-full px-2 my-2'>NOT</span> a json file, is it ?</span>
                </div>}
        </div>
    </div>
    const schema = flowlize(file.content)
    return (
        <>
            <header className="flex h-12 bg-background z-10 sticky top-0 shrink-0 justify-between items-center gap-2 border-b px-4">
                <div className='flex items-center gap-2'>
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink asChild>
                                    <Link href="/jsonizer">Jsonizer</Link></BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{file.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className='flex p-1 rounded-lg gap-1 bg-foreground/10 items-center'>
                    <Button className='h-6' variant={view === "flow" ? "ghost" : "default"} onClick={() => setView("code")}>Code view</Button>
                    <Button className='h-6' variant={view === "code" ? "ghost" : "default"} onClick={() => setView("flow")}>Flow view</Button>
                </div>
            </header> {view === "flow" ?
                <Flow nodes={schema.nodes} edges={schema.edges} /> :
                <ObjectViewer file={file} />
            }
        </>
    )
}
export default Page