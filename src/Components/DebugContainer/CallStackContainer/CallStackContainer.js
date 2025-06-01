import React, {useContext, useEffect, useState} from "react";

import {CaretDown, CaretRight} from "react-bootstrap-icons";

import StackContext from "../../../Providers/StackContext";
import {CallStackRow} from "./CallStackRow/CallStackRow";

import "./CallStackContainer.scss";

/**
 * Contains the call stack container.
 * @return {JSX.Element}
 */
export function CallStackContainer () {
    const [callStacks, setCallStacks] = useState([]);
    const [stacksCollapsed, setStacksCollapsed] = useState({});

    const {stacks} = useContext(StackContext);

    // Toggle collapse of stack frames
    const toggleCollapse = (threadId) => {
        const stackState = {...stacksCollapsed};

        if (stackState[threadId] == undefined) {
            stackState[threadId] = false;
        } else {
            stackState[threadId] = !stackState[threadId];
        }
        setStacksCollapsed(stackState);
    };

    useEffect(() => {
        if (stacks) {
            const threadIds = Object.keys(stacks).sort();
            const _stacks = [];

            threadIds.forEach((threadId, index) => {
                // Create call stack rows
                const calls = [];
                stacks[threadId].stack.callStack.forEach((call, index) => {
                    const row = <CallStackRow
                        key={index}
                        index={index}
                        functionName={call.functionName}
                        fileName={call.fileName}
                        filePath={call.filePath}
                        lineno={call.lineno}
                        position={call.position}
                        main={stacks[threadId].main}
                        threadId={threadId}
                    />;
                    calls.push(row);
                });

                // Create stack div
                const stackDiv = <div key={threadId} className="mb-2">
                    {(stacksCollapsed[threadId] == true || stacksCollapsed[threadId] === undefined)
                        ?
                        <div>
                            <span className="threadTitle">
                                <CaretDown className="me-1"
                                    onClick={() => toggleCollapse(threadId)}/>
                                    Thread-{threadId}
                            </span>
                            {calls}
                        </div>
                        :
                        <div>
                            <span className="threadTitle">
                                <CaretRight className="me-1"
                                    onClick={() => toggleCollapse(threadId)}/>
                                    Thread-{threadId}
                            </span>
                        </div>
                    }
                </div>;
                _stacks.push(stackDiv);
            });
            setCallStacks(_stacks);
        } else {
            setCallStacks([]);
        }
    }, [stacks, stacksCollapsed]);

    return (
        <div className="callStackContainer">
            {callStacks}
        </div>
    );
}
