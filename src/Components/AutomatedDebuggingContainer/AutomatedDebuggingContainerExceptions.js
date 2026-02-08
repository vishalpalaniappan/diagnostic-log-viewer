import React, {useContext, useEffect, useState} from "react";

import BehaviorContext from "../../Providers/BehaviorContext";
import { DebuggerNode } from "./DebuggerNode/DebuggerNode";

import "./AutomatedDebuggingContainer.scss";

/**
 * Container for automated debugging information.
 * @return {JSX.Element}
 */
export function AutomatedDebuggingContainerExceptions ({}) {
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
            const exception = {...exceptions[i]};
            exception.level = 0;
            exception.text = exception.behavior.behaviorInfo.intent_failed;
            exceptionsList.push(
                <DebuggerNode node={exception} />
            );
            if (exception.rootCause) {
                const node = {...exceptions[i].rootCause};
                node.level = 0;
                node.text = `${node.violation.violationSentence}`;
                exceptionsList.push(
                    <DebuggerNode node={node} />
                );
            }
        }
        setRows(exceptionsList);
    };

    return (
        <div className="debuggingContainer">
            <div className="topContainerDebugger">
                <div className="titleContainerDebugger">
                    <span className="titleDebugger">
                        Automated Debugging Container - Root Cause
                    </span>
                </div>
            </div>
            <div className="automatedDebuggingContainer">
                <div className="automatedDebuggingContainerScroll">
                    {rows}
                </div>
            </div>
        </div>
    );
}
