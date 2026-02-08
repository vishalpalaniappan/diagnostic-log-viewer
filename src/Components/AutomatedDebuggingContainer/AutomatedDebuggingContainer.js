import React, {useContext, useEffect, useState} from "react";

import BehaviorContext from "../../Providers/BehaviorContext";
import { DebuggerNode } from "./DebuggerNode/DebuggerNode";

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
            const node = exceptions[i];
            node.level = 0;
            node.collapsible = true;
            node.text = "Exception: " + node.behavior.sentence;
            exceptionsList.push(
                <DebuggerNode node={node} />
            );
            if (node.rootCause) {
                const node = exceptions[i].rootCause;
                node.level = 1;
                node.text = `Root cause: ${node.violation.participantName} violated constraint ${node.violation.type} with value ${node.violation.value}`;
                exceptionsList.push(
                    <DebuggerNode node={node} />
                );
            }
        }
        setRows(exceptionsList);
    };

    return (
        <div className="w-100 h-100 automated-debugging-container">
            {rows}
        </div>
    );
}
