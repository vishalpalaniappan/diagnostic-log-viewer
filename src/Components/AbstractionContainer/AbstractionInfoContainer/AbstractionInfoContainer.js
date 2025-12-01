import React, {useContext, useEffect} from "react";

import ReactJsonView from "@microlink/react-json-view";

import StackContext from "../../../Providers/StackContext";

import "./AbstractionInfoContainer.scss";

/**
 * Contains the abstraction info container.
 * @return {JSX.Element}
 */
export function AbstractionInfoContainer () {
    const {stacks, activeThread, setActiveThread} = useContext(StackContext);
    const [abstractionInfo, setAbstractionInfo] = React.useState();

    useEffect(() => {
        if (stacks) {
            for (const threadId of Object.keys(stacks)) {
                if (stacks[threadId].main) {
                    const stack = stacks[threadId].stack;
                    console.log(stack);
                    const executionTree = stack.execTree;

                    const list = [];

                    executionTree.forEach((exec, index) => {
                        const paddingLeft = (exec[0] * 10) + "px";
                        list.push(
                            <div className="abstractionRow" 
                                style={{paddingLeft: paddingLeft}}
                                key={index}> {exec[1]}
                            </div>
                        );
                    });

                    console.log(list);

                    setAbstractionInfo(list);
                    break;
                }
            };
        }
    }, [stacks]);

    return (
        <div className="abstractionInfoContainer w-100 h-100 ">
            {abstractionInfo}
        </div>
    );
}
