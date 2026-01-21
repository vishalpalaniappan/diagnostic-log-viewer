import React, {useCallback, useContext, useEffect, useState} from "react";

import {layoutTrace} from "./layout";

import {
    Background,
    Controls,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";

import BehaviorContext from "../../Providers/BehaviorContext";

import "@xyflow/react/dist/style.css";

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
    const {activeBehavior, behavior} = useContext(BehaviorContext);
    const [nodes, setNodes, onNodesChange] = useNodesState();
    const [edges, setEdges, onEdgesChange] = useEdgesState();

    useEffect(() => {
        if (behavior && activeBehavior) {
            const entry = behavior.atomicAbstractions[activeBehavior.atomicUid];
            console.log("Selected Atomic Abstraction:", entry);
            const layout = layoutTrace(entry);
            setNodes(layout.nodes);
        }
    }, [behavior, activeBehavior]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            colorMode={"dark"}
            fitView
        >
            <Controls />
        </ReactFlow>
    );
}
