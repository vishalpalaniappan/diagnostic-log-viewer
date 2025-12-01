import React, {useContext, useEffect, useState} from "react";

import StackContext from "../../../Providers/StackContext";
import {AbstractionRow} from "./AbstractionRow/AbstractionRow";
import ExecutionTreeContext from "./ExecutionTreeContext";

import "./AbstractionInfoContainer.scss";

/**
 * Contains the abstraction info container.
 * @return {JSX.Element}
 */
export function AbstractionInfoContainer () {
    const {stacks, activeThread} = useContext(StackContext);
    const [executionArray, setExecutionArray] = useState();
    const [executionTree, setExecutionTree] = useState();

    const renderTree = () => {
        if (executionArray) {
            const execution = [];
            let collapsedLevel;
            let collapsing = false;

            for (let index = 0; index < executionArray.length; index++) {
                const node = executionArray[index];

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

            setExecutionTree(execution);
        }
    };

    const toggleCollapse = (node) => {
        node.collapsed = !node.collapsed;
        renderTree();
    };

    useEffect(() => {
        renderTree();
    }, [executionArray]);

    useEffect(() => {
        if (stacks) {
            const stack = stacks[activeThread].stack;
            setExecutionArray(stack.executionTree);
        };
    }, [stacks]);

    return (
        <ExecutionTreeContext.Provider value={{executionArray, toggleCollapse}}>
            <div className="abstractionInfoContainer w-100 h-100 ">
                {executionTree}
            </div>
        </ExecutionTreeContext.Provider>
    );
}
