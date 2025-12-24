import React, {useContext, useEffect, useState} from "react";

import {CircleFill} from "react-bootstrap-icons";

import ExecutionTreeContext from "../../Providers/ExecutionTreeContext";
import {DesignNode} from "./DesignNode/DesignNode";
import DesignTreeInstanceContext from "./DesignTreeInstanceContext";

import "./DesignTree.scss";

/**
 * Contains the execution tree.
 * @return {JSX.Element}
 */
export function DesignTree () {
    const {behavior, activeBehavior, setActiveBehavior,
        semanticState, executionTree} = useContext(ExecutionTreeContext);
    const [selectedNode, setSelectedNode] = useState();
    const [executionTreeInstance, setExecutionTreeInstance] = useState();

    useEffect(() => {
        if (behavior) {
            renderTree();

            // Find last root behavior and expand
            for (let i = behavior.length - 1; i >= 0; i--) {
                const entry = behavior[i];
                if (entry.collapsible) {
                    entry.collapsed = false;
                }
                if (entry.level === 0) {
                    break;
                }
            }
            setActiveBehavior(behavior.length - 1);
        }
    }, [behavior]);

    useEffect(() => {
        if (!(activeBehavior === null || activeBehavior === undefined)) {
            // Uncollapse all the nodes in the current branch
            for (let i = activeBehavior; i >= 0; i--) {
                const entry = behavior[i];
                if (entry.collapsible) {
                    entry.collapsed = false;
                }
                if (entry.level === 0) {
                    break;
                }
            }
            setSelectedNode(behavior[activeBehavior]);
            renderTree();
        }
    }, [activeBehavior]);


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
        if (behavior) {
            const execution = [];
            let collapsedLevel;
            let collapsing = false;

            for (let index = 0; index < behavior.length; index++) {
                const node = behavior[index];

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
                        <DesignNode
                            key={index}
                            node={node}/>
                    );
                    continue;
                }

                // If we aren't collapsing this node, then add the node.
                if (!collapsing) {
                    execution.push(<DesignNode
                        key={index}
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
     * Set the collapse state of the node.
     * @param {Object} node
     * @param {Object} state
     */
    const setCollapsed = (node, state) => {
        node.collapsed = state;
        renderTree();
    };

    /**
     * Select the given node, this function is called from execution node.
     * @param {Object} selectedNode
     */
    const selectNode = (selectedNode) => {
        for (let index = 0; index < behavior.length; index++) {
            const node = behavior[index];
            if (node === selectedNode) {
                setActiveBehavior(index);
                node.selected = true;
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
        }
    }, [executionTree]);

    return (
        <DesignTreeInstanceContext.Provider
            value={{selectedNode, selectNode, toggleCollapse, setCollapsed}}>
            <div className="treeMenuContainer">
                <div className="topContainer">
                    <div className="titleContainer">
                        {
                            semanticState === "behavior" &&
                            <CircleFill className="focusIndicator"
                                title="Keyboard shortcuts focused on behavior."/>
                        }
                        <span className="title">Behavioral Trace</span>
                    </div>
                    <div className="iconMenu">
                    </div>
                </div>
                <div className="executionTreeContainer scrollbar flex-grow-1">
                    {executionTreeInstance}
                </div>
            </div>
        </DesignTreeInstanceContext.Provider>
    );
}

export default DesignTree;
