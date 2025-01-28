"use client"
import ELK from 'elkjs/lib/elk.bundled.js';
import React, { useCallback, useLayoutEffect } from 'react';
import {
    Background,
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
    MiniMap,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import CustomNode from './custom-node';
import { GithubIcon, MaximizeIcon, MinusIcon, PlusIcon, RotateCcwIcon } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { useDropzoneContext } from '@/components/dropzone/dropzone-provider';
// import { useCommandContext } from '@/components/command-provider';

const elk = new ELK();
const elkOptions = {
    "elk.algorithm": "layered",
    "elk.layered.spacing.nodeNodeBetweenLayers": "200",
    "elk.spacing.nodeNode": "150",
    "elk.edgeRouting": "SPLINES",
    "elk.eclipse.elk.nodeSize.options": "MINIMUM_SIZE_ACCOUNTS_FOR_PADDING",
    "elk.direction": "DOWN"
};
const nodeTypes = {
    custom: CustomNode,
};
const getLayoutedElements = (nodes: any, edges: any, options = {}) => {
    // @ts-ignore
    const isHorizontal = options?.['elk.direction'] === 'RIGHT';
    const graph = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node: any) => {
            const height = node.data.type == "image" ? 230 : 50 + Object.keys(node.data.data).length * 24
            return ({
                ...node,
                // Adjust the target and source handle positions based on the layout
                // direction.
                targetPosition: isHorizontal ? 'left' : 'top',
                sourcePosition: isHorizontal ? 'right' : 'bottom',

                // Hardcode a width and height for elk to use when layouting.
                width: 330,
                height: height,
            })
        }),
        edges: edges,
    };

    return elk
        .layout(graph)
        .then((layoutedGraph) => ({
            //@ts-ignore
            nodes: layoutedGraph.children.map((node) => ({
                ...node,
                position: { x: node.x, y: node.y },
            })),

            edges: layoutedGraph.edges,
        }))
        .catch(console.error);
};

function Flow({ nodes: initialNodes, edges: initialEdges }: { nodes: any, edges: any }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { fitView, zoomIn, zoomOut } = useReactFlow();
    const { setOpenCommand, setShowEditor, showEditor } = useDropzoneContext()

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );
    const onLayout = useCallback(
        ({ direction, useInitialNodes = false }: { direction: any, useInitialNodes: boolean }) => {
            //@ts-ignore
            const opts = { 'elk.direction': direction, ...elkOptions };
            const ns = useInitialNodes ? initialNodes : nodes;
            const es = useInitialNodes ? initialEdges : edges;

            getLayoutedElements(ns, es, opts).then(
                //@ts-ignore
                ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                    setNodes(layoutedNodes);
                    setEdges(layoutedEdges);
                    fitView();
                },
            );
        },
        // @ts-ignore
        [initialNodes, initialEdges],
    );

    useLayoutEffect(() => {
        onLayout({ direction: 'RIGHT', useInitialNodes: true });
    }, [onLayout]);

    return (
        <ReactFlow
            className='p-0'
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            proOptions={{ hideAttribution: true }}
            nodeTypes={nodeTypes}
        >
            <Panel className='bg-transparent' position="top-left">
                <div className='flex items-center gap-1'>
                    <Button onClick={() => setShowEditor(!showEditor)} variant="outline" className="text-sm">
                        {showEditor ? "Hide editor " : "Show editor "}
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                            <span className="text-xs">⌘</span>k
                        </kbd>
                    </Button>
                </div>
            </Panel>
            <Panel className='bg-transparent' position="top-right">
                <div className='flex items-center gap-1'>
                    <Button onClick={() => setOpenCommand(true)} variant="outline" className="text-sm">
                        Command{" "}
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                            <span className="text-xs">⌘</span>J
                        </kbd>
                    </Button>
                    {/* @ts-ignore */}
                    <Button variant="outline" size="icon" className='px-2 flex items-center gap-2' onClick={() => onLayout({ direction: 'DOWN' })}>
                        <RotateCcwIcon className='h-3 w-3' />
                    </Button>
                    <ModeToggle />
                    <a href={"https://github.com/reconurge/jsonizer"} target='_blank'>
                        <Button variant="outline" size="icon" className='px-2 flex items-center gap-2'>
                            <GithubIcon className='h-3 w-3' />
                        </Button>
                    </a>
                </div>
            </Panel>
            <Background />
            <Panel className='bg-transparent' position="bottom-left">
                <div className='flex flex-col items-center gap-1'>
                    <Button size={"icon"} onClick={() => fitView()} variant="outline">
                        <MaximizeIcon className='h-3 w-3' />
                    </Button>
                    <Button size={"icon"} onClick={() => zoomIn()} variant="outline">
                        <PlusIcon className='h-3 w-3' />
                    </Button>
                    <Button size={"icon"} onClick={() => zoomOut()} variant="outline">
                        <MinusIcon className='h-3 w-3' />
                    </Button>
                </div>
            </Panel>
            <Background />
            <MiniMap maskColor='hsl(var(--background))' className='!bg-background shadow rounded-md border border-foreground/5' pannable zoomable position='bottom-right' nodeStrokeWidth={3} />
        </ReactFlow>
    );
}

const RootFlow = (props: any) => (
    <ReactFlowProvider>
        <Flow {...props} />
    </ReactFlowProvider>
);
export default RootFlow