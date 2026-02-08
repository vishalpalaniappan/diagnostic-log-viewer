import React, {useContext, useEffect, useState} from "react";

import BehaviorContext from "../../Providers/BehaviorContext";
import {ExceptionRow} from "./ExceptionRow/ExceptionRow";

import "./AutomatedDebuggingContainer.scss";

/**
 * Container for automated debugging information.
 * @return {JSX.Element}
 */
export function AutomatedDebuggingContainer ({}) {
    const {behavior} = useContext(BehaviorContext);
    const [rows, setRows] = useState();

    useEffect(() => {
        if (behavior) {
            console.log(behavior);
            processExceptions(behavior.debugger.exceptions);
        }
    }, [behavior]);

    /**
     * Proces the exceptions in the file.
     * @param {Array} exceptions
     */
    const processExceptions = (exceptions) => {
        const exceptionsList = [];
        for (let i = 0; i < exceptions.length; i++) {
            exceptionsList.push(
                <ExceptionRow violation={exceptions[i]}/>
            );
        }
        setRows(exceptionsList);
    };

    return (
        <div className="w-100 h-100 automated-debugging-container">
            {rows}
        </div>
    );
}
