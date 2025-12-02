import React, {useContext, useEffect, useState} from "react";

import ExecutionTreeContext from "../../Providers/ExecutionTreeContext";
import StackContext from "../../Providers/StackContext";
import StackPositionContext from "../../Providers/StackPositionContext";
import {AbstractionRow} from "./ExecutionNode/ExecutionNode";
import ExecutionTreeInstanceContext from "./ExecutionTreeInstanceContext";
import {ExecutionTreeToolKitBottom} from "./ExecutionTreeToolKitBottom/ExecutionTreeToolKitBottom";
import {ExecutionTreeToolKitTop} from "./ExecutionTreeToolKitTop/ExecutionTreeToolKitTop";

import "./ExecutionTree.scss";

/**
 * Contains the abstraction info container.
 * @return {JSX.Element}
 */
export function ExecutionTree () {
    const {executionTree} = useContext(ExecutionTreeContext);
    const {stackPosition} = useContext(StackPositionContext);
    const {stacks, activeThread, setActiveAbstraction} = useContext(StackContext);
    const [selectedNode, setSelectedNode] = useState();
    const [executionArray, setExecutionArray] = useState();
    const [executionTreeInstance, setExecutionTreeInstance] = useState();

    // Sync selected stack with the execution tree. This is to enable
    // backwards compatibility but in the future, we can eliminate the stack.
    useEffect(() => {
        if (stacks) {
            const stack = stacks[activeThread].stack;
            const stackLevel = stack.callStack[stackPosition].position;
            for (let index = 0; index < executionTree.length; index++) {
                const node = executionTree[index];
                if (node.position === stackLevel) {
                    node.selected = true;
                    setSelectedNode(node);
                } else {
                    node.selected = false;
                }
            }
        }
    }, [stackPosition, stacks]);

    /**
     * Render the execution tree.
     */
    const renderTree = () => {
        if (executionTree) {
            const execution = [];
            let collapsedLevel;
            let collapsing = false;

            for (let index = 0; index < executionTree.length; index++) {
                const node = executionTree[index];

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

            setExecutionTreeInstance(execution);
        }
    };

    const toggleCollapse = (node) => {
        node.collapsed = !node.collapsed;
        renderTree();
    };

    const selectNode = (selectedNode) => {
        for (let index = 0; index < executionTree.length; index++) {
            const node = executionTree[index];
            if (node === selectedNode) {
                node.selected = true;
                setActiveAbstraction({
                    index: index,
                    node: node,
                });
                setSelectedNode(node);
            } else {
                node.selected = false;
            }
        }
    };

    useEffect(() => {
        if (executionTree) {
            renderTree();
        }
    }, [executionTree]);

    return (
        <ExecutionTreeInstanceContext.Provider
            value={{executionArray, selectedNode, selectNode, toggleCollapse}}>
            <div className="w-100 h-100 d-flex flex-column">
                <div style={{height: "20px"}}>
                    <ExecutionTreeToolKitTop />
                </div>
                <div className="executionTreeContainer flex-grow-1">
                    {executionTreeInstance}
                </div>
                <div style={{height: "20px"}}>
                    <ExecutionTreeToolKitBottom/>
                </div>
            </div>
        </ExecutionTreeInstanceContext.Provider>
    );
}

export default ExecutionTree;
