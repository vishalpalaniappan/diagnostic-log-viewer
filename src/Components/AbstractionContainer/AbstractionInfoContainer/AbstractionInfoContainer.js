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

            executionArray.forEach((exec, index) => {
                execution.push(
                    <AbstractionRow
                        key={index}
                        node={exec}
                    />
                );
            });

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
