"use client"
import { useDropzoneContext } from '@/components/dropzone/dropzone-provider'
import { cn } from '@/lib/utils'
import React from 'react'
const Page = () => {
    const { isDragActive } = useDropzoneContext()
    return (
        <div className={cn('h-full w-full p-24 flex flex-col items-center justify-center')}>
            <div className={cn('h-full border-4 border-dotted p-8 overflow-hidden relative w-full rounded-xl flex flex-col items-center justify-center', isDragActive && "border-primary")}>
                <span className='text-5xl font-bold text-primary'>JSONIZER</span><span className='text-xl italic'>JSON file viewer</span>
                <span className='mt-4 text-center'>Drag and drop your JSON files here to visalize their contents. Don&apos;t worry, none of it is stored anywhere, except your browser&apos;s localStorage.</span>
                <div className={cn('absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm duration-300', isDragActive ? "opacity-100" : "opacity-0")}>
                    <span className='text-xl font-semibold'> Oh ! Drop it, let&apos;s see it !</span>
                </div>
            </div>
        </div>
    )
}

export default Page