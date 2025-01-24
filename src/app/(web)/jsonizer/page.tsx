"use client"
import { useDropzoneContext } from '@/components/dropzone/dropzone-provider'
import { cn } from '@/lib/utils'
import React from 'react'
import { CloudUploadIcon } from 'lucide-react'
const Page = () => {
    const { isDragActive, isDragAccept, isDragReject } = useDropzoneContext()
    return (
        <div className={cn('h-full w-full p-24 flex flex-col items-center justify-center')}>
            <div className={cn('h-full border-4 border-dotted p-24 overflow-hidden relative w-full rounded-xl flex flex-col items-center justify-center', isDragActive && !isDragReject ? "border-primary" : isDragReject && "border-destructive")}>
                <CloudUploadIcon className='h-20 w-20 text-primary/80' />
                <p className='mt-4 text-center font-semibold'>Drag and drop your JSON files here to visalize their contents.</p>
                <p className='opacity-60'>Don&apos;t worry, none of it is stored anywhere, except your browser&apos;s localStorage.</p>
                <div className={cn('absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm duration-300', isDragActive && !isDragReject ? "opacity-100" : "opacity-0")}>
                    <span className='text-xl font-semibold'> Oh ! Drop it, let&apos;s see it !</span>
                </div>
                {isDragAccept &&
                    <div className={cn('absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm duration-300')}>
                        <span className='text-xl font-semibold'>Let&apos;s extract it...</span>
                    </div>}
                {isDragReject &&
                    <div className={cn('absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm duration-300')}>
                        <span className='text-xl font-semibold'>Woho. That&apos;s <span className='border border-destructive/80 bg-destructive/30 text-destructive rounded-full px-2 my-2'>NOT</span> a json file, is it ?</span>
                    </div>}
            </div>
        </div>
    )
}

export default Page