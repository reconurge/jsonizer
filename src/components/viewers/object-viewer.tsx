"use client"
import { useTheme } from 'next-themes'
import React from 'react'
import ReactJson from 'react-json-view'

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