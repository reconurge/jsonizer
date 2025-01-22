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

const page = () => {
    const { fileContents } = useDropzoneContext()
    const [view, setView] = useQueryState("view", { defaultValue: "flow" })
    const { file_id } = useParams()
    const file = React.useMemo(() => fileContents.find((file) => file.id === file_id), [fileContents, file_id]);
    if (!file) return <div className='p-2'>loading...</div>
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
                                <BreadcrumbLink href="#">Local storage</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{file.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className='flex p-1 rounded-lg gap-1 bg-foreground/10 items-center'>
                    <Button size={"sm"} variant={view === "flow" ? "ghost" : "default"} onClick={() => setView("code")}>Code view</Button>
                    <Button size={"sm"} variant={view === "code" ? "ghost" : "default"} onClick={() => setView("flow")}>Flow view</Button>
                </div>
            </header> {view === "flow" ?
                <Flow file={file} nodes={schema.nodes} edges={schema.edges} /> :
                <ObjectViewer file={file} />
            }
        </>
    )
}
export default page