import React, {useContext, useEffect, useState} from "react";

import {CaretDown} from "react-bootstrap-icons";

import StackContext from "../../../Providers/StackContext";
import {CallStackRow} from "./CallStackRow/CallStackRow";

import "./CallStackContainer.scss";

/**
 * Contains the call stack container.
 * @return {JSX.Element}
 */
export function CallStackContainer () {
    const [callStacks, setCallStacks] = useState([]);

    const {stacks} = useContext(StackContext);

    useEffect(() => {
        if (stacks) {
            const threadIds = Object.keys(stacks);
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
                    <span className="threadTitle"> <CaretDown/> Thread-{threadId}</span>
                    {calls}
                </div>;
                _stacks.push(stackDiv);
            });

            setCallStacks(_stacks);
        } else {
            setCallStacks([]);
        }
    }, [stacks]);

    return (
        <div className="callStackContainer">
            {callStacks}
        </div>
    );
}
