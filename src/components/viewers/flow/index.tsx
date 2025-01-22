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
        children: nodes.map((node: any) => ({
            ...node,
            // Adjust the target and source handle positions based on the layout
            // direction.
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',

            // Hardcode a width and height for elk to use when layouting.
            width: 350,
            height: 210,
        })),
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
        [],
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
        [nodes, edges],
    );

    useLayoutEffect(() => {
        onLayout({ direction: 'RIGHT', useInitialNodes: true });
    }, []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            nodeTypes={nodeTypes}
        >
            <Panel position="top-right">
                <div className='flex items-center gap-3'>
                    {/* @ts-ignore */}
                    <button onClick={() => onLayout({ direction: 'DOWN' })}>
                        vertical layout
                    </button>
                    {/* @ts-ignore */}
                    <button onClick={() => onLayout({ direction: 'RIGHT' })}>
                        horizontal layout
                    </button>
                </div>
            </Panel>
            <Background />
            <MiniMap />
            <Controls />
        </ReactFlow>
    );
}

export default (props: any) => (
    <ReactFlowProvider>
        <Flow {...props} />
    </ReactFlowProvider>
);