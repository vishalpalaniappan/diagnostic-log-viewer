import React, {useContext, useEffect, useState} from "react";

import StackContext from "../../../Providers/StackContext";
import { AbstractionRow } from "./AbstractionRow/AbstractionRow";

import "./AbstractionInfoContainer.scss";

/**
 * Contains the abstraction info container.
 * @return {JSX.Element}
 */
export function AbstractionInfoContainer () {
    const {stacks, activeThread} = useContext(StackContext);
    const [executionTree, setExecutionTree] = useState();


    const renderTree = () => {
        if (stacks) {
            const stack = stacks[activeThread].stack;
            const executionArray = stack.executionTree;
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

    useEffect(() => {
        if (stacks) {
            renderTree();
        }
    }, [stacks]);

    return (
        <div className="abstractionInfoContainer w-100 h-100 ">
            {executionTree}
        </div>
    );
}
