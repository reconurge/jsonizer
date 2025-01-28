"use client"
import { useDropzoneContext } from "@/components/dropzone/dropzone-provider"
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

export default function Page() {
    const { content, setContent, showEditor } = useDropzoneContext()
    const [flowlized, setFlowlized] = useState<null | any>(null)
    const [error, setError] = useState<null | any>(null)
    const { theme } = useTheme()

    useEffect(() => {
        async function flow() {
            setError(null)
            try {
                setFlowlized(await flowlize(JSON.parse(content)))
            } catch (e) {
                setError(JSON.stringify(e))
            }
        }
        flow()
    }, [content, setFlowlized, setError])

    return (
        <ResizablePanelGroup
            autoSaveId="conditional"
            direction="horizontal"
            className="w-screen h-screen"
        >
            {showEditor &&
                <ResizablePanel id="left" order={1} defaultSize={showEditor ? 40 : 0} className="h-screen p-0 border-none">
                    <Editor className="border-none" theme={theme === "dark" ? "vs-dark" : "vs-light"} height="100vh" defaultLanguage="json" onChange={(e) => setContent(e || "")} value={content} />
                </ResizablePanel>}
            <ResizableHandle withHandle />
            {flowlized?.nodes && flowlized?.edges &&
                < ResizablePanel id="right" order={3} defaultSize={60} className="h-screen border-black">
                    {error ? <div className="h-full w-full flex items-center justify-center text-italic opacity-60">Your JSON tree will show here when it&apos;s nice and correct.</div> :
                        flowlized?.nodes && flowlized?.edges && <Flow nodes={flowlized.nodes} edges={flowlized.edges} />}
                </ResizablePanel>
            }
        </ResizablePanelGroup >
    )
}
