"use client"
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import React from 'react'
const ReactJson = dynamic(() => import('react-json-view',), { ssr: false })

const ObjectViewer = ({ file }: { file: any }) => {
    const { theme } = useTheme()
    return (
        <div>
            <div>
                <ReactJson style={{ padding: 12 }} theme={theme === "dark" ? "brewer" : "rjv-default"} src={file.content} />
            </div>
        </div>
    )
}

export default ObjectViewer