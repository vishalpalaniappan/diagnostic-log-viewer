import React, {useCallback, useContext, useEffect, useState} from "react";

import {ChevronLeft, ChevronRight} from "react-bootstrap-icons";

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
    const {stacks, setActiveThread, activeThread, setActiveAbstraction} = useContext(StackContext);
    const [selectedNode, setSelectedNode] = useState();
    const [segInstance, setSegInstance] = useState();
    const [threads, setThreads] = useState();
    const [currThreadPosition, setCurrThreadPosition] = useState();
    const [title, setTitle] = useState();

    // Sync selected stack with the SEG. We use stack position to find current
    // executed position in SEG for each thread. This preserves backward
    // comaptibility while also allowing us to navigate the program using SEG.
    useEffect(() => {
        if (!stacks || !seg) {
            return;
        }

        if (!(activeThread in stacks)) {
            setSelectedNode(undefined);
            return;
        }

        const stack = stacks[activeThread].stack;
        const segInstance = seg[activeThread];
        for (let index = 0; index < segInstance.length; index++) {
            if (segInstance[index].abstraction.position === stack.callStack[0].position) {
                setSelectedNode(segInstance[index]);
                renderTree(activeThread);
                setTitle(`Current Position: Thread (${currThreadPosition + 1}/${threads?.length})`);
            }
        }
    }, [stackPosition, activeThread, stacks, seg]);

    /**
     * Scroll to the selected node.
     * @param {Object} node
     */
    const scrollToNode = (node) => {
        const nodeElement = document.getElementById("row" + node.abstraction.threadId + node.index);
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
        renderTree(node.abstraction.threadId);
    };

    /**
     * Select the given node, this function is called from execution node.
     * @param {Object} node
     */
    const selectNode = (node) => {
        setActiveAbstraction({
            node: node,
        });
    };

    /**
     * Render the tree when the execution tree changes.
     */
    useEffect(() => {
        if (seg && activeThread) {
            const threads = Object.keys(seg);
            setThreads(threads);
            setCurrThreadPosition(threads.indexOf(activeThread));
            renderTree(activeThread);
            setTitle(`Current Position: Thread (${currThreadPosition + 1}/${threads?.length})`);
        }
    }, [activeThread, currThreadPosition, seg]);

    /**
     * Load the previous thread in SEG container.
     */
    const goToPrevThread = () => {
        const newPosition = currThreadPosition - 1;
        if (newPosition >= 0) {
            const stackThreads = Object.keys(stacks);
            if (stackThreads.includes(threads[newPosition])) {
                renderTree(threads[newPosition]);
                setActiveThread(threads[newPosition]);
                setTitle(`Current Position: Thread (${currThreadPosition + 1}/${threads?.length})`);
                return;
            } else {
                renderTree(threads[newPosition]);
                setTitle(`Thread (${newPosition + 1}/${threads?.length}) has not started yet.`);
                return;
            }
        }
        setTitle(`Current Position: Thread (${currThreadPosition + 1}/${threads?.length})`);
        renderTree(activeThread);
    };

    /**
     * Load the next thread in the SEG container.
     */
    const goToNextThread = () => {
        const newPosition = currThreadPosition + 1;
        if (newPosition < threads.length) {
            const stackThreads = Object.keys(stacks);
            if (stackThreads.includes(threads[newPosition])) {
                renderTree(threads[newPosition]);
                setActiveThread(threads[newPosition]);
                setTitle(`Current Position: Thread (${currThreadPosition + 1}/${threads?.length})`);
                return;
            } else {
                renderTree(threads[newPosition]);
                setTitle(`Thread (${newPosition + 1}/${threads?.length}) has not started yet.`);
                return;
            }
        }
        setTitle(`Current Position: Thread (${currThreadPosition + 1}/${threads?.length})`);
        renderTree(activeThread);
    };

    // Add keyboard shortcuts to navigate threads
    useEffect(() => {
        document.addEventListener("keydown", keydown, false);
        return () => {
            document.removeEventListener("keydown", keydown, false);
        };
    }, [threads, currThreadPosition, selectedNode]);

    /**
     * Callback function on keydown.
     */
    const keydown = useCallback((e) => {
        switch (e.code) {
            case "KeyX":
                goToNextThread();
                break;
            case "KeyZ":
                goToPrevThread();
                break;
            default:
                break;
        }
    }, [threads, currThreadPosition, selectedNode]);

    return (
        <SEGInstanceContext.Provider
            value={{selectedNode, selectNode, toggleCollapse}}>
            <div className="treeMenuContainer">
                <div className="topContainer">
                    <span className="prevThread" onClick={goToPrevThread}>
                        <ChevronLeft/>
                    </span>
                    <div className="titleContainer">
                        <span className="title">{title}</span>
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
