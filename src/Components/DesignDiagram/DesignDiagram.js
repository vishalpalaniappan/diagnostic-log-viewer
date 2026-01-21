import React, {useCallback, useRef, useState} from "react";

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
    {id: "1", position: {x: 0, y: 0}, data: {label: "1"}},
    {id: "2", position: {x: 0, y: 100}, data: {label: "2"}},
];

const initialEdges = [{id: "e1-2", source: "1", target: "2"}];

import "./DesignDiagram.scss";

/**
 * @return {JSX.Element}
 */
export function DesignDiagram ({}) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
        >
            <MiniMap />
            <Controls />
            <Background />
        </ReactFlow>
    );
}
