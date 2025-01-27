"use client"
import { DropzoneProvider, useDropzoneContext } from "@/components/dropzone/dropzone-provider"
import React, { useEffect, useState } from 'react'
import Flow from '@/components/viewers/flow'
import { flowlize } from '@/lib/flowlize'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Editor from '@monaco-editor/react';
import { useTheme } from "next-themes"

function formatJSON(val = {}) {
    try {
        // @ts-ignore
        const res = JSON.parse(val);
        return JSON.stringify(res, null, 2)
    } catch {
        return JSON.stringify({}, null, 2)
    }
}

export default function Page() {
    const { content, setContent } = useDropzoneContext()
    const [flowlized, setFlowlized] = useState<null | any>(null)
    const [error, setError] = useState<null | any>(null)
    const { theme } = useTheme()
    useEffect(() => {
        setError(null)
        try {
            setFlowlized(flowlize(JSON.parse(content)))
        } catch (e) {
            setError(JSON.stringify(e))
        }
    }, [content, setFlowlized, setError])

    return (
        <DropzoneProvider>
            <ResizablePanelGroup
                direction="horizontal"
                className="w-screen h-screen"
            >
                <ResizablePanel defaultSize={50} className="h-screen p-0 border-none">
                    <Editor className="border-none" theme={theme === "dark" ? "vs-dark" : "vs-light"} height="100vh" defaultLanguage="json" onChange={(e) => setContent(e || "")} value={formatJSON(content)} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50} className="h-screen border-black">
                    {error ? <div className="h-full w-full flex items-center justify-center text-italic opacity-60">Your JSON tree will show here when it&apos;s nice and correct.</div> :
                        flowlized?.nodes && flowlized?.edges && <Flow nodes={flowlized.nodes} edges={flowlized.edges} />}
                </ResizablePanel>
            </ResizablePanelGroup>
        </DropzoneProvider>
    )
}
