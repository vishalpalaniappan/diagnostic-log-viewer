import React, {useContext, useEffect, useState} from "react";

import StackContext from "../../../Providers/StackContext";
import {CallStackRow} from "./CallStackRow/CallStackRow";

import "./CallStackContainer.scss";

/**
 * Contains the call stack container.
 * @return {JSX.Element}
 */
export function CallStackContainer () {
    const [callStack, setCallStack] = useState();

    const {stack} = useContext(StackContext);

    useEffect(() => {
        if (stack) {
            const calls = [];
            stack.forEach((call, index) => {
                const row = <CallStackRow
                    key={index}
                    index={index}
                    functionName={call.functionName}
                    fileName={call.fileName}
                    filePath={call.filePath}
                    lineno={call.lineno}
                    position={call.position}
                />;
                calls.push(row);
            });
            setCallStack(calls);
        }
    }, [stack]);

    return (
        <div className="callStackContainer">
            {callStack}
        </div>
    );
}
