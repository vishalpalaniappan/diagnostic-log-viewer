import React, {useContext, useEffect, useState} from "react";

import AppStateContext from "../../../../../Providers/AppStateContext";
import {CallStackRow} from "./CallStackRow/CallStackRow";

import "./CallStackContainer.scss";

/**
 * Contains the call stack container.
 * @return {JSX.Element}
 */
export function CallStackContainer () {
    const [callStack, setCallStack] = useState();

    const {appState} = useContext(AppStateContext);

    useEffect(() => {
        if (appState && appState.callStack) {
            const calls = [];
            appState.callStack.forEach((call, index) => {
                const row = <CallStackRow
                    key={index}
                    functionName={call.functionName}
                    fileName={call.fileName}
                    lineno={call.lineno}
                    position={call.position}
                />;
                calls.push(row);
            });
            setCallStack(calls);
        }
    }, [appState]);

    return (
        <div className="callStackContainer">
            {callStack}
        </div>
    );
}
