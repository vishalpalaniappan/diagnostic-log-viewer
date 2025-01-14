import React, {useContext, useEffect, useState} from "react";

import AppStateContext from "../../../../../Providers/AppStateContext";

import "./CallStackContainer.scss";

/**
 * Contains the call stack container.
 * @return {JSX.Element}
 */
export function CallStackContainer () {
    const [callStack, setCallStack] = useState();

    const {appState} = useContext(AppStateContext);

    useEffect(() => {
        if (appState) {
            console.log(appState.callStack);
            setCallStack(appState.callStack);
        }
    }, [appState]);

    return (
        <div className="callStackContainer">

        </div>
    );
}
