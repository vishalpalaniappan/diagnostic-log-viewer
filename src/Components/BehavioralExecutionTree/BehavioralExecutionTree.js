import React, {useContext, useEffect, useState} from "react";

import BehaviorContext from "../../Providers/BehaviorContext";
import StackContext from "../../Providers/StackContext";
import {BehavioralExecutionNode} from "./BehavioralExecutionNode/BehavioralExecutionNode";
import BehavioralExecutionTreeContext from "./BehavioralExecutionTreeContext";

import "./BehavioralExecutionTree.scss";

/**
 * Contains the semantic execution graph.
 * @return {JSX.Element}
 */
export function BehavioralExecutionTree () {
    const {behavior, activeBehavior, setActiveBehavior} = useContext(BehaviorContext);
    const {setActiveAbstraction} = useContext(StackContext);
    const [selectedNode, setSelectedNode] = useState();
    const [executionTree, setExecutionTree] = useState();
    const [executionTreeNodes, setExecutionTreeNodes] = useState();
    const [title, setTitle] = useState();

    /**
     * Scroll to the selected node.
     * @param {Object} node
     */
    const scrollToNode = (node) => {
        const nodeElement = document.getElementById("behavior-execution-row" + node.index);
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
     * Renders the behavioral tree.
     */
    const renderTree = () => {
        if (executionTree) {
            const nodes = [];
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
                    nodes.push(
                        <BehavioralExecutionNode
                            key={index}
                            node={node}/>
                    );
                    continue;
                }

                // If we aren't collapsing this node, then add the node.
                if (!collapsing) {
                    nodes.push(<BehavioralExecutionNode
                        key={index}
                        node={node}/>
                    );
                }
            }
            setExecutionTreeNodes(nodes);
            setActiveAbstraction({
                node: executionTree[executionTree.length - 1],
            });
        }
    };

    useEffect(() => {
        if (executionTree) {
            renderTree();
        }
    }, [executionTree]);

    useEffect(() => {
        if (behavior && activeBehavior) {
            setTitle("Behavioral Execution Tree");
            setExecutionTree(behavior[activeBehavior].execution);
        }
    }, [behavior, activeBehavior]);

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
     * @param {Object} node
     */
    const selectNode = (node) => {
        setActiveAbstraction({
            node: node,
        });
    };


    return (
        <BehavioralExecutionTreeContext.Provider
            value={{selectedNode, selectNode, toggleCollapse}}>
            <div className="treeMenuContainer">
                <div className="behavioralTreeContainer scrollbar flex-grow-1">
                    {executionTreeNodes}
                </div>
            </div>
        </BehavioralExecutionTreeContext.Provider>
    );
}

export default BehavioralExecutionTree;
