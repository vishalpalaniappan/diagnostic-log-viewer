import React, {useContext, useEffect, useState} from "react";

import {
    Controls,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";

import StackContext from "../../Providers/StackContext.js";
import {getLayoutedElements} from "./DagreLayout.js";
import {getLayoutInfoFromTree} from "./helper.js";

import "@xyflow/react/dist/style.css";

/**
 * Flow component which reners the dependency graph.
 * @param {Object} tree
 * @return {JSX.Element}
 */
export function Flow (tree) {
    const {fitView} = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (tree.tree) {
            tree = tree.tree;
            const flowInfo = getLayoutInfoFromTree(tree.data, tree.animated ?? false);

            // direction: TB, BT, LR, or RL,
            // where T = top, B = bottom, L = left, and R = right.
            const layouted = getLayoutedElements(
                flowInfo.nodes,
                flowInfo.edges,
                {
                    direction: tree.orientation,
                    ranksep: 70,
                    nodesep: 250,
                }
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
 *
 * @param {Object} treeInfo
 * @return {JSX.Element}
 */
export function FlowDiagram (treeInfo) {
    const [tree, setTree] = useState();
    const {stacks, activeThread, setActiveThread} = useContext(StackContext);

    // useEffect(() => {
    //     setTree(treeInfo.treeInfo);
    // }, [treeInfo]);


    useEffect(() => {
        if (stacks) {
            const stack = stacks[activeThread].stack;
            const designFlow = stack.designFlow;

            // Flatten design flow
            let path = [];
            designFlow.forEach((level, index) => {
                path = path.concat(level);
            });

            // Create flow graph object
            const obj = {};
            obj["orientation"] = "TB";
            obj["data"] = {};
            obj["data"]["path"] = path;

            setTree(obj);
        }
    }, [stacks]);

    return (
        <ReactFlowProvider>
            <Flow tree={tree} />
        </ReactFlowProvider>
    );
};
