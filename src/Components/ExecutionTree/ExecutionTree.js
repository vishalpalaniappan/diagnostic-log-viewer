import React, {useContext, useEffect, useState} from "react";

import ExecutionTreeContext from "../../Providers/ExecutionTreeContext";
import StackContext from "../../Providers/StackContext";
import StackPositionContext from "../../Providers/StackPositionContext";
import {AbstractionRow} from "./ExecutionNode/ExecutionNode";
import ExecutionTreeInstanceContext from "./ExecutionTreeInstanceContext";

import "./ExecutionTree.scss";

/**
 * Contains the execution tree.
 * @return {JSX.Element}
 */
export function ExecutionTree () {
    const {behavior, activeBehavior} = useContext(ExecutionTreeContext);
    const {stackPosition} = useContext(StackPositionContext);
    const {stacks, activeThread, setActiveAbstraction} = useContext(StackContext);
    const [selectedNode, setSelectedNode] = useState();
    const [executionTreeInstance, setExecutionTreeInstance] = useState();
    const [rootCauses, setRootCauses] = useState();
    const [executionTree, setExecutionTree] = useState();


    useEffect(() => {
        if (!(activeBehavior === null || activeBehavior === undefined)) {
            setExecutionTree(behavior[activeBehavior].execution);
        }
    }, [behavior, activeBehavior]);

    // Sync selected stack with the execution tree. This is to enable
    // backwards compatibility but in the future, we can eliminate the stack.
    useEffect(() => {
        if (!stacks || stackPosition === undefined || !executionTree || !stacks[activeThread]) {
            return;
        }
        const stack = stacks[activeThread].stack;
        if (!stack?.callStack || stackPosition >= stack.callStack.length) {
            return;
        }
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
    }, [stackPosition, stacks, executionTree]);


    /**
     * Scroll to the selected node.
     * @param {Object} node
     */
    const scrollToNode = (node) => {
        const nodeElement = document.getElementById("row" + node.index);
        if (nodeElement) {
            nodeElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    };

    /**
     * Scroll to node when selected node changes.
     */
    useEffect(() => {
        if (selectedNode) {
            scrollToNode(selectedNode);
        }
    }, [selectedNode]);

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
                    execution.push(
                        <AbstractionRow
                            key={node.index}
                            node={node}/>
                    );
                    continue;
                }

                // If we aren't collapsing this node, then add the node.
                if (!collapsing) {
                    execution.push(<AbstractionRow
                        key={node.index}
                        node={node}/>
                    );
                }
            }
            setExecutionTreeInstance(execution);
        }
    };

    /**
     * Collapse the given node
     * @param {Object} node
     */
    const toggleCollapse = (node) => {
        node.collapsed = !node.collapsed;
        renderTree();
    };

    /**
     * Select the given node, this function is called from execution node.
     * @param {Object} selectedNode
     */
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

    /**
     * Render the tree when the execution tree changes.
     *
     * TODO: Change the way this is implemented.
     */
    useEffect(() => {
        if (executionTree) {
            getRootCause();
            renderTree();
        }
    }, [executionTree]);


    // Adds a temporary display to show the root cause of failure below
    // the semantic design graph if there was a failure.
    const getRootCause = () => {
        if (executionTree.length === 0) {
            setRootCauses(null);
            return;
        }
        const lastEntry = executionTree[executionTree.length - 1];
        if (lastEntry && "failureInfo" in lastEntry) {
            const rootCauseDivs = [];
            lastEntry["failureInfo"].forEach((failure, index) => {
                rootCauseDivs.push(
                    <div key={index} className="rootcause">{failure.cause}</div>
                );
            });
            setRootCauses(
                <div className="bottomContainer scrollbar">
                    <div className="title">Root Cause(s) of Failure</div>
                    {rootCauseDivs}
                </div>
            );
        } else {
            setRootCauses(null);
        }
    };

    return (
        <ExecutionTreeInstanceContext.Provider
            value={{selectedNode, selectNode, toggleCollapse}}>
            <div className="treeMenuContainer">
                <div className="topContainer">
                    <div className="titleContainer">
                        <span className="title">Semantic Execution Graph</span>
                    </div>
                    <div className="iconMenu">
                    </div>
                </div>
                <div className="executionTreeContainer scrollbar flex-grow-1">
                    {executionTreeInstance}
                </div>
                {rootCauses}
            </div>
        </ExecutionTreeInstanceContext.Provider>
    );
}

export default ExecutionTree;
