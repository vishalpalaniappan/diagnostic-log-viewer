import React, {useContext, useEffect, useState} from "react";

import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

import SegContext from "../../Providers/SegContext";
import StackContext from "../../Providers/StackContext";
import StackPositionContext from "../../Providers/StackPositionContext";
import SEGInstanceContext from "./SEGInstanceContext";
import {SEGNode} from "./SEGNode/SEGNode";

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
    const [selectedNodeByThread, setSelectedNodeByThread] = useState({});
    const [segInstance, setSegInstance] = useState();
    const [threads, setThreads] = useState();
    const [currThreadPosition, setCurrThreadPosition] = useState();

    // Sync selected stack with the SEG. We use stack position to find current
    // executed position in SEG for each thread. This preserves backward
    // comaptibility while also allowing us to navigate the program using SEG.
    useEffect(() => {
        if (!stacks || !seg || !threads) {
            return;
        }
        const selectedNodes = {};
        for (let tIndex = 0; tIndex < threads.length; tIndex++) {
            const threadId = threads[tIndex];

            // Verify that the thread ID exists in seg and the stacks.
            if (!(threadId in stacks) || !(threadId in seg)) {
                return;
            }

            const stack = stacks[threadId].stack;
            const segInstance = seg[threadId];
            for (let index = 0; index < segInstance.length; index++) {
                if (segInstance[index].position === stack.callStack[0].position) {
                    // Set the active position in each thread.
                    selectedNodes[threadId] = segInstance[index];
                    if (threadId === activeThread) {
                        // Save the active node and the active thread
                        setSelectedNode(segInstance[index]);
                        setCurrThreadPosition(threads.indexOf(activeThread));
                    }
                }
            }
        }
        // Save the seleted position in each thread to state.
        setSelectedNodeByThread(selectedNodes);
    }, [stackPosition, activeThread, stacks, threads, seg]);

    /**
     * Scroll to the selected node.
     * @param {Object} node
     */
    const scrollToNode = (node) => {
        const nodeElement = document.getElementById("row" + node.threadId + node.index);
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
     * Renders the tree given the thread id.
     * @param {String} threadId
     */
    const renderTree = (threadId) => {
        if (seg) {
            const threadSeg = seg[threadId];
            const nodes = [];
            let collapsedLevel;
            let collapsing = false;

            for (let index = 0; index < threadSeg.length; index++) {
                const node = threadSeg[index];

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
                    nodes.push(
                        <SEGNode
                            key={threadId + node.index}
                            node={node}/>
                    );
                    continue;
                }

                // If we aren't collapsing this node, then add the node.
                if (!collapsing) {
                    nodes.push(<SEGNode
                        key={threadId + node.index}
                        node={node}/>
                    );
                }
            }
            setSegInstance(nodes);
        }
    };

    /**
     * Collapse the given node
     * @param {Object} node
     */
    const toggleCollapse = (node) => {
        node.collapsed = !node.collapsed;
        renderTree(node.threadId);
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
                setActiveAbstraction({
                    index: index,
                    node: node,
                });
            }
        }
    };

    /**
     * Render the tree when the execution tree changes.
     */
    useEffect(() => {
        if (seg && activeThread) {
            const threads = Object.keys(seg);
            setThreads(threads);
            renderTree(activeThread);
        }
    }, [activeThread, seg]);

    /**
     * Load the previous thread in SEG container.
     */
    const goToPrevThread = () => {
        const newPosition = currThreadPosition - 1;
        if (newPosition >= 0) {
            setCurrThreadPosition(newPosition);
            renderTree(threads[newPosition]);
            setSelectedNode(
                selectedNodeByThread[threads[newPosition]]
            );
        }
    };

    /**
     * Load the next thread in the SEG container.
     */
    const goToNextThread = () => {
        const newPosition = currThreadPosition + 1;
        if (newPosition < threads.length) {
            setCurrThreadPosition(newPosition);
            renderTree(threads[newPosition]);
            setSelectedNode(
                selectedNodeByThread[threads[newPosition]]
            );
        }
    };

    return (
        <SEGInstanceContext.Provider
            value={{selectedNode, selectNode, selectedNodeByThread, toggleCollapse}}>
            <div className="treeMenuContainer">
                <div className="topContainer">
                    <span className="prevThread" onClick={goToPrevThread}>
                        <ChevronLeft/>
                    </span>
                    <div className="titleContainer">
                        <span className="title">
                            Thread ({currThreadPosition + 1}/{threads?.length}) : {activeThread}
                        </span>
                    </div>
                    <span className="nextThread" onClick={goToNextThread}>
                        <ChevronRight/>
                    </span>
                </div>
                <div className="executionTreeContainer scrollbar flex-grow-1">
                    {segInstance}
                </div>
            </div>
        </SEGInstanceContext.Provider>
    );
}

export default SemanticExecutionGraph;
