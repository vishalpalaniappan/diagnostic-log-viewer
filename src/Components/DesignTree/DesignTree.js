import React, {useContext, useEffect, useState} from "react";

import ExecutionTreeContext from "../../Providers/ExecutionTreeContext";
import {DesignNode} from "./DesignNode/DesignNode";
import DesignTreeInstanceContext from "./DesignTreeInstanceContext";

import "./DesignTree.scss";

/**
 * Contains the execution tree.
 * @return {JSX.Element}
 */
export function DesignTree () {
    const {functionalSequence, executionTree} = useContext(ExecutionTreeContext);
    const [selectedNode, setSelectedNode] = useState();
    const [executionTreeInstance, setExecutionTreeInstance] = useState();

    useEffect(() => {
        if (functionalSequence) {
            console.log(functionalSequence);
        }
    }, [functionalSequence]);


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
        if (functionalSequence) {
            const execution = [];

            for (let index = 0; index < functionalSequence.length; index++) {
                const node = functionalSequence[index];

                if (node.isBehavior) {
                    node.level = 0;
                } else {
                    node.level = 1;
                }
                execution.push(<DesignNode
                    key={index}
                    node={node}/>
                );
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
        for (let index = 0; index < functionalSequence.length; index++) {
            const node = functionalSequence[index];
            if (node === selectedNode) {
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
            renderTree();
        }
    }, [executionTree]);

    return (
        <DesignTreeInstanceContext.Provider
            value={{selectedNode, selectNode, toggleCollapse}}>
            <div className="treeMenuContainer">
                <div className="topContainer">
                    <div className="titleContainer">
                        <span className="title">Design Trace</span>
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
