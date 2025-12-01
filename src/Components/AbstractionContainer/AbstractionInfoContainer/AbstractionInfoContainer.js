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

    const collapseLevels = (e, exec, index) => {
        exec.collapsed = !exec.collapsed;
        console.log("Collapsed:", exec);
        getAbstractions();
    };

    const getAbstractions = () => {
        if (stacks) {
            const list = [];
            for (const threadId of Object.keys(stacks)) {
                if (stacks[threadId].main) {
                    const stack = stacks[threadId].stack;
                    const executionTree = stack.execTree;
                    let collapsedLevel = 0;
                    let collapsing = false;

                    executionTree.forEach((exec, index) => {
                        const paddingLeft = (exec.level * 10) + "px";
                        if (exec.collapsed && !collapsing) {
                            collapsedLevel = Number(exec.level);
                            collapsing = true;
                        }

                        if (collapsing && Number(exec.level) > collapsedLevel) {
                            collapsing = true;
                        } else {
                            list.push(
                                <div className="abstractionRow"
                                    onClick={(e) => collapseLevels(e, exec, index)}
                                    style={{paddingLeft: paddingLeft}}
                                    key={index}> {exec.intent}
                                </div>
                            );
                        }

                        console.log(exec.level, collapsedLevel, exec.level > collapsedLevel);                      
                    });

                    break;
                }
            }
            setAbstractionInfo(list);
        }
    };

    useEffect(() => {
        if (stacks) {
            getAbstractions();
        }
    }, [stacks]);

    return (
        <div className="abstractionInfoContainer w-100 h-100 ">
            {abstractionInfo}
        </div>
    );
}
