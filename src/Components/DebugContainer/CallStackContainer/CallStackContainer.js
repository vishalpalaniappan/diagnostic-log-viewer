import React, {useContext, useEffect, useState} from "react";

import StackContext from "../../../Providers/StackContext";
import {CallStackRow} from "./CallStackRow/CallStackRow";

import {CaretRight, CaretDown} from "react-bootstrap-icons";

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
        } else {
            setCallStack([]);
        }
    }, [stack]);

    return (
        <div className="callStackContainer">
            <div className="mb-2">
                <span className="threadTitle"> <CaretDown/> Thread-1</span>
                {callStack}
            </div>
            <div className="mb-2">
                <span className="threadTitle"> <CaretDown/> Thread-2</span>
                {callStack}
            </div>
            <div className="">
                <span className="threadTitle"> <CaretDown/> Thread-3</span>
                {callStack}
            </div>
        </div>
    );
}
