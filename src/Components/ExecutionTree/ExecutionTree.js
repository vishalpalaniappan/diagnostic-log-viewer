import React, {useContext, useEffect, useState} from "react";

import StackContext from "../../Providers/StackContext";
import {AbstractionRow} from "./ExecutionNode/ExecutionNode";
import ExecutionTreeContext from "./ExecutionTreeContext";
import {ExecutionTreeToolKitBottom} from "./ExecutionTreeToolKitBottom/ExecutionTreeToolKitBottom";
import {ExecutionTreeToolKitTop} from "./ExecutionTreeToolKitTop/ExecutionTreeToolKitTop";

import "./ExecutionTree.scss";

/**
 * Contains the abstraction info container.
 * @return {JSX.Element}
 */
export function ExecutionTree () {
    const {stacks, activeThread} = useContext(StackContext);
    const [selectedNode, setSelectedNode] = useState();
    const [executionArray, setExecutionArray] = useState();
    const [executionTree, setExecutionTree] = useState();

    const renderTree = () => {
        if (executionArray) {
            const execution = [];
            let collapsedLevel;
            let collapsing = false;

            for (let index = 0; index < executionArray.length; index++) {
                const node = executionArray[index];

                // If we are collapsing and we reached the same
                // level or below, then stop collapsing.
                if (collapsing && node.level <= collapsedLevel) {
                    collapsing = false;
                }

                // If the node is collapsed and we aren't collapsing
                // then start collapsing
                if (node.collapsed && !collapsing) {
                    collapsedLevel = node.level;
                    collapsing = true;
                    execution.push(<AbstractionRow key={node.index} node={node} />);
                    continue;
                }

                // If we aren't collapsing this node, then add the node.
                if (!collapsing) {
                    execution.push(<AbstractionRow key={node.index} node={node} />);
                }
            }

            setExecutionTree(execution);
        }
    };

    const toggleCollapse = (node) => {
        node.collapsed = !node.collapsed;
        renderTree();
    };

    const selectNode = (selectedNode) => {
        for (let index = 0; index < executionArray.length; index++) {
            const node = executionArray[index];
            if (node === selectedNode) {
                node.selected = true;
                setSelectedNode(node);
            } else {
                node.selected = false;
            }
        }
    };

    useEffect(() => {
        renderTree();
    }, [executionArray]);

    useEffect(() => {
        if (stacks) {
            const stack = stacks[activeThread].stack;
            setExecutionArray(stack.executionTree);
        };
    }, [stacks]);

    return (
        <ExecutionTreeContext.Provider
            value={{executionArray, selectedNode, selectNode, toggleCollapse}}>
            <div className="w-100 h-100 d-flex flex-column">
                <div style={{height: "20px"}}>
                    <ExecutionTreeToolKitTop />
                </div>
                <div className="executionTreeContainer flex-grow-1">
                    {executionTree}
                </div>
                <div style={{height: "20px"}}>
                    <ExecutionTreeToolKitBottom/>
                </div>
            </div>
        </ExecutionTreeContext.Provider>
    );
}
