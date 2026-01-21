import React, {useContext, useEffect, useState} from "react";

import BehaviorContext from "../../Providers/BehaviorContext";
import BehavioralGraphContext from "./BehavioralGraphContext";
import {BehavioralNode} from "./BehavioralNode/BehavioralNode";

import "./BehavioralGraph.scss";

/**
 * Contains the semantic execution graph.
 * @return {JSX.Element}
 */
export function BehavioralGraph () {
    // eslint-disable-next-line max-len
    const {behavior, activeBehavior, setActiveStepExecution, setActiveBehavior} = useContext(BehaviorContext);
    const [selectedNode, setSelectedNode] = useState();
    const [behavioralInstance, setBehavioralInstance] = useState();
    const [behavioralTree, setBehavioralTree] = useState();
    const [title, setTitle] = useState();

    /**
     * Scroll to the selected node.
     * @param {String} activeBehavior
     */
    const scrollToNode = (activeBehavior) => {
        const id = "behavior-row-" + activeBehavior.uid;
        const nodeElement = document.getElementById(id);
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
        if (activeBehavior) {
            scrollToNode(activeBehavior);
        }
    }, [activeBehavior]);


    const getAtomicHeaderRow = (node) => {
        node.level = 0;
        return <BehavioralNode
            key={node.atomicUid}
            node={node}
        />;
    };

    /**
     * Renders the behavioral tree.
     */
    const renderTree = () => {
        if (behavior) {
            const rows = [];
            let collapsedLevel;
            let collapsing = false;
            for (let index = 0; index < behavioralTree.length; index++) {
                const node = behavioralTree[index];

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
                    rows.push(
                        <BehavioralNode
                            key={node.uid}
                            node={node}/>
                    );
                    continue;
                }

                // If we aren't collapsing this node, then add the node.
                if (!collapsing) {
                    rows.push(<BehavioralNode
                        key={node.uid}
                        node={node}/>
                    );
                }
            }
            setBehavioralInstance(rows);

            if (activeBehavior === undefined || activeBehavior === null ) {
                const keys = Object.keys(behavior.atomicAbstractions);
                const node = behavior.atomicAbstractions[keys[keys.length -1]];
                const step = node.trace[node.trace.length - 1];
                setActiveBehavior({
                    uid: step.uid,
                });
                setActiveStepExecution(step.execution);
            }
        }
    };


    /**
     * Create the behavioral tree from the atomic abstractions.
     */
    const createTree = () => {
        const keys = Object.keys(behavior.atomicAbstractions);
        let nodes = [];
        for (let i = 0; i < keys.length; i++) {
            const node = behavior.atomicAbstractions[keys[i]];
            nodes.push(node);
            nodes = nodes.concat(
                createNodes(node.rootTrace, 0)
            );
        }
        for (let i = 1; i < nodes.length; i++) {
            const prevNode = nodes[i-1];
            const currNode = nodes[i];
            if (currNode.level > prevNode.level) {
                prevNode.collapsible = true;
                prevNode.collapsed = false;
            }
        }
        setBehavioralTree(nodes);
    };

    /**
     * Create the nodes. Recurse for fanout node types.
     * @param {Object} nodes
     * @param {Number} level
     * @return {Array}
     */
    const createNodes = (nodes, level) => {
        let rows = [];
        for (let index = 0; index < nodes.length; index++) {
            const node = {...nodes[index]};
            node.level = node.level + level;
            rows.push(node);
            if (node.type === "fanout") {
                rows = rows.concat(createNodes(node.fork, node.level));
            }
        }
        return rows;
    };

    useEffect(() => {
        if (behavioralTree) {
            renderTree();
        }
    }, [behavioralTree]);

    useEffect(() => {
        if (behavior) {
            setTitle("Behavioral Tree");
            createTree();
        }
    }, [behavior]);

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
        setActiveBehavior({
            uid: node.uid,
        });
        setActiveStepExecution(node.execution);
    };


    return (
        <BehavioralGraphContext.Provider
            value={{selectedNode, selectNode, toggleCollapse}}>
            <div className="treeMenuContainer">
                <div className="topContainer">
                    <div className="titleContainer">
                        <span className="title">{title}</span>
                    </div>
                </div>
                <div className="behavioralTreeContainer scrollbar flex-grow-1">
                    {behavioralInstance}
                </div>
            </div>
        </BehavioralGraphContext.Provider>
    );
}

export default BehavioralGraph;
