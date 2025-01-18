import React, {useContext, useEffect, useState} from "react";

import StackStateContext from "../../../Providers/StackStateContext";
import WorkerContext from "../../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../../Services/CDL_WORKER_PROTOCOL";
import {CallStackRow} from "./CallStackRow/CallStackRow";

import "./CallStackContainer.scss";

/**
 * Contains the call stack container.
 * @return {JSX.Element}
 */
export function CallStackContainer () {
    const [callStack, setCallStack] = useState();

    const {stack} = useContext(StackStateContext);
    const {cdlWorker} = useContext(WorkerContext);

    useEffect(() => {
        if (stack) {
            const calls = [];
            stack.forEach((call, index) => {
                const row = <CallStackRow
                    key={index}
                    index={index}
                    functionName={call.functionName}
                    fileName={call.fileName}
                    lineno={call.lineno}
                    position={call.position}
                />;
                calls.push(row);
            });
            setCallStack(calls);

            if (cdlWorker) {
                cdlWorker.current.postMessage({
                    code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
                    args: {
                        position: stack[0].position,
                    },
                });
            }
        }
    }, [stack]);

    return (
        <div className="callStackContainer">
            {callStack}
        </div>
    );
}
