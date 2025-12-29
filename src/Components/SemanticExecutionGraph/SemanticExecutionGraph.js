import React, {useContext, useEffect, useState} from "react";

import SegContext from "../../Providers/SegContext";
import StackContext from "../../Providers/StackContext";
import StackPositionContext from "../../Providers/StackPositionContext";
import SEGInstanceContext from "./SEGInstanceContext";
import {SEGNode} from "./SEGNode/SEGNode";
import {ThreadStartNode} from "./ThreadStartNode/ThreadStartNode";

import "./SemanticExecutionGraph.scss";

/**
 * Contains the semantic execution graph.
 * @return {JSX.Element}
 */
export function SemanticExecutionGraph () {
    const {seg} = useContext(SegContext);
    const {stackPosition} = useContext(StackPositionContext);
    const {stacks, activeThread, setActiveAbstraction} = useContext(StackContext);
    const [selectedNode, setSelectedNode] = useState();
    const [segInstance, setSegInstance] = useState();

    // Sync selected stack with the execution tree. This is to enable
    // backwards compatibility but in the future, we can eliminate the stack.
    useEffect(() => {
        if (!stacks || stackPosition === undefined || !seg || !stacks[activeThread]) {
            return;
        }
        const stack = stacks[activeThread].stack;
        if (!stack?.callStack || stackPosition >= stack.callStack.length) {
            return;
        }
        const stackLevel = stack.callStack[stackPosition].position;
        const threadId = stack.callStack[stackPosition].threadId;
        if (!("threadId" in seg)) {
            return;
        }
        for (let index = 0; index < seg[threadId].length; index++) {
            const node = seg[threadId][index];
            if (node.position === stackLevel) {
                node.selected = true;
                setSelectedNode(node);
            } else {
                node.selected = false;
            }
        }
    }, [stackPosition, stacks, seg]);


    /**
     * Scroll to the selected node.
     * @param {Object} node
     */
    const scrollToNode = (node) => {
        const nodeElement = document.getElementById("row" + node.threadId+ node.index);
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
        if (seg) {
            const execution = [];
            const threads = Object.keys(seg);

            for (let tIndex = 0; tIndex < threads.length; tIndex++) {
                const threadId = threads[tIndex];
                const threadSeg = seg[threadId];
                let collapsedLevel;
                let collapsing = false;

                for (let index = 0; index < threadSeg.length; index++) {
                    const node = threadSeg[index];

                    // Render the row which is the root of the thread.
                    if (node.startMarker) {
                        execution.push(
                            <ThreadStartNode key={"start-" + threadId} node={node}/>
                        );
                        if (node.collapsed) {
                            collapsedLevel = node.level;
                            collapsing = true;
                        }
                        continue;
                    }

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
                            <SEGNode
                                key={threadId + node.index}
                                node={node}/>
                        );
                        continue;
                    }

                    // If we aren't collapsing this node, then add the node.
                    if (!collapsing) {
                        execution.push(<SEGNode
                            key={threadId + node.index}
                            node={node}/>
                        );
                    }
                }
            }
            setSegInstance(execution);
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
        const threadId = selectedNode.threadId;
        for (let index = 0; index < seg[threadId].length; index++) {
            const node = seg[threadId][index];
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
     */
    useEffect(() => {
        if (seg) {
            renderTree();
        }
    }, [seg]);

    return (
        <SEGInstanceContext.Provider
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
                    {segInstance}
                </div>
            </div>
        </SEGInstanceContext.Provider>
    );
}

export default SemanticExecutionGraph;
