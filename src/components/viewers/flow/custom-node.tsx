import React, { Dispatch, memo, SetStateAction, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
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
import ReactJson from 'react-json-view';

export function NodeModal({ data, label, open, setOpen }: { data: object, label: string, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent className="sm:max-w-[80vw] max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <ReactJson src={data} />
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
    const [open, setOpen] = useState(false)
    return (
        <>
            <div onClick={() => setOpen(true)} className="shadow-md overflow-hidden rounded-sm w-auto h-full bg-background/60 border-2 border-foreground/10">
                <div className='flex items-center border-b p-0 gap-4 border-foreground/10'>
                    <div className='border-r'>
                        <div>{icons[data.type as "object" | "array"] as any}</div>
                    </div>
                    <div>{data.label}</div>
                </div>
                <div className="flex p-2 flex-col">
                    <ul>
                        {data && data.data && typeof data.data === 'object' ? (
                            Object.keys(data.data).map((key, index) => (
                                <li key={index}>
                                    <span className='text-primary/80 font-normal text-sm'>{key}</span>: <span className='font-semibold text-lg'>{data.data[key]}</span>
                                </li>
                            ))
                        ) : (
                            <li>{data?.value ?? 'No data available'}</li>
                        )}
                    </ul>
                </div>
                <Handle
                    type="target"
                    position={Position.Top}
                    className="w-16 !bg-teal-500"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="w-16 !bg-teal-500"
                />
            </div>
            <NodeModal open={open} data={data.data} label={data.label} setOpen={setOpen} />
        </>
    );
}

export default memo(CustomNode);