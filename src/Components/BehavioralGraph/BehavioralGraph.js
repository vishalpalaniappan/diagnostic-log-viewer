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
    const {behavior, activeBehavior, setActiveBehavior} = useContext(BehaviorContext);
    const [selectedNode, setSelectedNode] = useState();
    const [behavioralInstance, setBehavioralInstance] = useState();
    const [title, setTitle] = useState();

    /**
     * Scroll to the selected node.
     * @param {String} activeBehavior
     */
    const scrollToNode = (activeBehavior) => {
        const node = behavior[activeBehavior];
        const nodeElement = document.getElementById("behavior-row-node-" + node.index);
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
            key={node.uid}
            node={node}
        />;
    };

    /**
     * Renders the behavioral tree.
     */
    const renderTree = () => {
        if (behavior) {
            const keys = Object.keys(behavior.atomicAbstractions);
            const nodes = [];
            for (let i = 0; i < keys.length; i++) {
                nodes.push(
                    getAtomicHeaderRow(behavior.atomicAbstractions[keys[i]])
                );
                const atomic = behavior.atomicAbstractions[keys[i]].rootTrace;
                let collapsedLevel;
                let collapsing = false;

                for (let index = 0; index < atomic.length; index++) {
                    const node = atomic[index];

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
                            <BehavioralNode
                                key={i + "-" + index}
                                node={node}/>
                        );
                        continue;
                    }

                    // If we aren't collapsing this node, then add the node.
                    if (!collapsing) {
                        nodes.push(<BehavioralNode
                            key={i + "-" + index}
                            node={node}/>
                        );
                    }
                }
                setBehavioralInstance(nodes);

                // if (activeBehavior === undefined || activeBehavior === null ) {
                //     setActiveBehavior({
                //         uid: behavior.atomicAbstractions[keys[i]].uid,
                //         index: i,
                //     });
                // }
            }
        }
    };

    useEffect(() => {
        if (behavior) {
            setTitle("Behavioral Tree");
            renderTree();
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
        setActiveBehavior(node.index);
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
