"use client"
import React, { Dispatch, memo, SetStateAction, useState } from 'react';
import { Handle, Position, useNodeId, useReactFlow } from '@xyflow/react';
import { BracesIcon, BracketsIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
const ReactJson = dynamic(() => import('react-json-view',), { ssr: false })

export function NodeModal({ data, label, open, setOpen, theme }: { data: any, label: string, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, theme: string }) {
    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent className="sm:max-w-[80vw] max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {data && <ReactJson style={{ padding: 12 }} theme={theme === "dark" ? "brewer" : "rjv-default"} src={data} />}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const icons = {
    "object": <BracesIcon className='h-4 w-4' />,
    "array": <BracketsIcon className='h-4 w-4' />
}
function CustomNode({ data }: { data: any }) {
    const { theme } = useTheme()
    const [open, setOpen] = useState(false)
    const { setNodes } = useReactFlow();
    const nodeId = useNodeId();
    const handleHideNode = () => {
        setNodes((nodes) => {
            return nodes.map((node) =>
                node.id === nodeId
                    ? { ...node, hidden: true }
                    : node
            );
        });
    }
    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div onClick={() => setOpen(true)} className={cn("shadow-md overflow-hidden rounded-sm w-auto h-full border-2 border-foreground/10", data.type === "array" ? "dark:bg-[#1E1E1E]/50 bg-[#1E1E1E]/5" : "dark:bg-[#1E1E1E]/50 bg-[#1E1E1E]/5")}>
                        <div className={cn('flex items-center border-b p-0 gap-2 border-foreground/10', data.type === "array" ? "dark:bg-[#1E1E1E]/60 bg-[#1E1E1E]/10" : "dark:bg-[#1E1E1E]/60 bg-[#1E1E1E]/10")}>
                            <div>{icons[data.type as "object" | "array"] as any}</div>
                            <div>{data.label}</div>
                        </div>
                        <div className="flex p-2 flex-col">
                            <ul>
                                {data && data.data && typeof data.data === 'object' ? (
                                    Object.keys(data.data).map((key, index) => {
                                        if (typeof data.data[key] === "object" && !Array.isArray(data.data[key]))
                                            return (
                                                <li className='flex flex-nowrap' key={index}>
                                                    <span className='text-[#8DC4E2]/80 italic font-semibold'>{key}</span>:<span className='font-semibold ml-1'><span className='rounded-full truncate text-ellipsis px-1 py-.5 border-cyan-500/80 bg-cyan-500/10 text-cyan-500 text-xs'>{data.data[key]?.value}</span><span className='text-orange-500 text-xs font-medium italic ml-1'>{typeof data.data[key]}</span></span>
                                                </li>
                                            )
                                        if (Array.isArray(data.data[key]))
                                            return (
                                                <li className='flex flex-nowrap' key={index}>
                                                    <span className='text-[#8DC4E2] italic font-semibold'>{key}</span>: <span className='font-semibold'><span className='truncate text-ellipsis rounded-full px-1 py-.5 border-purple-500/80 bg-purple-500/10 text-purple-500 text-xs'>{data.data[key][0]}</span><span className='text-orange-500 text-xs font-medium italic ml-1'>{"array"}</span></span>
                                                </li>
                                            )
                                        if (typeof data.data[key] === "boolean")
                                            return (
                                                <li className='flex flex-nowrap' key={index}>
                                                    <span className='text-[#8DC4E2] italic font-semibold'>{key}</span>: <span className='font-semibold'><span className='truncate text-ellipsis rounded-full px-1 py-.5 text-purple-500'>{Boolean(data.data[key]) ? "true" : "false"}</span><span className='text-orange-500 text-xs font-medium italic ml-1'>{"boolean"}</span></span>
                                                </li>
                                            )
                                        return (
                                            <li className='flex flex-nowrap' key={index}>
                                                <span className='text-[#8DC4E2] italic font-semibold'>{key}</span>: <span className='font-semibold truncate text-ellipsis text-[#BC866F]'>{data.data[key]}<span className='text-xs font-medium italic ml-1'>{typeof data.data[key]}</span></span>
                                            </li>
                                        )
                                    })
                                ) : (
                                    <li>{data?.value ?? 'No data available'}</li>
                                )}
                            </ul>
                        </div>
                        <Handle
                            type="target"
                            position={Position.Top}
                            className="!w-2 h-2 !bg-orange-500"
                        />
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            className="!w-2 h-2 !bg-orange-500"
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-36">
                    <ContextMenuItem onClick={handleHideNode} inset>
                        Hide
                        {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
                    </ContextMenuItem>
                    {/* <ContextMenuItem inset disabled>
                        Forward
                        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        Reload
                        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                    </ContextMenuItem> */}
                </ContextMenuContent>
            </ContextMenu>
            <NodeModal theme={theme || "light"} open={open} data={data.data} label={data.label} setOpen={setOpen} />
        </>
    );
}

export default memo(CustomNode);