import React, {useCallback, useEffect, useState} from "react";

import {
    Controls,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";

import {getLayoutedElements} from "./DagreLayout.js";
import {getLayoutInfoFromTree} from "./helper.js";

import "@xyflow/react/dist/style.css";

/**
 *
 * @param {Object} tree
 * @return {JSX.Element}
 */
export function Flow (tree) {
    const {fitView} = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (tree) {
            const flowInfo = getLayoutInfoFromTree(tree.data);

            // direction: TB, BT, LR, or RL,
            // where T = top, B = bottom, L = left, and R = right.
            const layouted = getLayoutedElements(
                flowInfo.nodes,
                flowInfo.edges,
                {direction: tree.orientation}
            );

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            fitView();
        }
    }, [tree]);

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
};

/**
 * This component renders a flow diagram using react flow.
 * @param {Object} treeInfo
 * @return {JSX.Element}
 */
export function FlowDiagram (treeInfo) {
    const [tree, setTree] = useState();

    useEffect(() => {
        setTree(treeInfo);
    }, [treeInfo]);

    return (
        <ReactFlowProvider>
            <Flow tree={tree} />
        </ReactFlowProvider>
    );
};
