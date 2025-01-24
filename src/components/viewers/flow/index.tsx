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
    Controls,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import CustomNode from './custom-node';

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
            return ({
                ...node,
                // Adjust the target and source handle positions based on the layout
                // direction.
                targetPosition: isHorizontal ? 'left' : 'top',
                sourcePosition: isHorizontal ? 'right' : 'bottom',

                // Hardcode a width and height for elk to use when layouting.
                width: 330,
                height: 50 + Object.keys(node.data.data).length * 24,
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
    const { fitView } = useReactFlow();

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

                    window.requestAnimationFrame(() => fitView());
                },
            );
        },
        // @ts-ignore
        [],
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
            <Panel className='bg-background shadow rounded-md border border-foreground/5' position="top-right">
                <div className='flex items-center divide-x px-1 py-1'>
                    {/* @ts-ignore */}
                    <button className='px-2' onClick={() => onLayout({ direction: 'DOWN' })}>
                        <span className='opacity-60 text-sm'>vertical</span>
                    </button>
                    {/* @ts-ignore */}
                    <button className='px-2' onClick={() => onLayout({ direction: 'RIGHT' })}>
                        <span className='opacity-60 text-sm'>horizontal</span>
                    </button>
                </div>
            </Panel>
            <Background />
            {/* <MiniMap maskColor='hsl(var(--primary-foreground, 0.19))' className='!bg-background' pannable zoomable position='bottom-right' nodeStrokeWidth={3} /> */}
            <Controls className='!bg-background' />
        </ReactFlow>
    );
}

const RootFlow = (props: any) => (
    <ReactFlowProvider>
        <Flow {...props} />
    </ReactFlowProvider>
);
export default RootFlow