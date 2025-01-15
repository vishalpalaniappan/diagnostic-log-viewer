import React, {useContext, useEffect, useState} from "react";

import PositionStateContext from "../../../../../Providers/PositionStateContext";
import WorkerContext from "../../../../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../../../../Services/CDL_WORKER_PROTOCOL";
import {CallStackRow} from "./CallStackRow/CallStackRow";

import "./CallStackContainer.scss";

/**
 * Contains the call stack container.
 * @return {JSX.Element}
 */
export function CallStackContainer () {
    const [callStack, setCallStack] = useState();

    const {positionState} = useContext(PositionStateContext);
    const {cdlWorker} = useContext(WorkerContext);

    useEffect(() => {
        if (positionState && positionState.callStack) {
            const stack = positionState.callStack;
            const calls = [];
            stack.forEach((call, index) => {
                const row = <CallStackRow
                    key={index}
                    functionName={call.functionName}
                    fileName={call.fileName}
                    lineno={call.lineno}
                    position={call.position}
                />;
                calls.push(row);
            });
            setCallStack(calls.reverse());

            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
                args: {
                    position: stack[stack.length - 1].position,
                },
            });
        }
    }, [positionState]);

    return (
        <div className="callStackContainer">
            {callStack}
        </div>
    );
}
