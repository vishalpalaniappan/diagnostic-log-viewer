import React, {useCallback, useContext, useEffect, useState} from "react";

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
import LayoutDesign, {layoutTrace} from "./layout";

import "@xyflow/react/dist/style.css";
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
            // TODO: These functions are oudated, disabling them for now.
            // const layoutInstance = new LayoutDesign();
            // const layout = layoutInstance.processDesign(entry);
            // setNodes(layout.nodes);
            // setEdges(layout.edges);
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
