import React, {useContext, useEffect, useState} from "react";

import BehaviorContext from "../../Providers/BehaviorContext";
import {DebuggerNodeRootCause} from "./DebuggerNodeRootCause/DebuggerNodeRootCause";

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
                <DebuggerNodeRootCause key={i} node={exception} />
            );
            if (exception.rootCause) {
                const node = {...exceptions[i].rootCause};
                node.level = 0;
                node.text = `${node.violation.rootCauseSentence}`;
                exceptionsList.push(
                    <DebuggerNodeRootCause key={i + "r"} node={node} />
                );
            } else {
                // I'm simulating an invariant node an adding the failed
                // root cause msg. It a bit hacky but it works for now.
                // TODO: Create a dedicated node for this?
                const node = {};
                node.level = 0;
                node.violation = {};
                node.violation.violation_type = "invariant";
                // eslint-disable-next-line max-len
                node.text = "The root cause of this failure was not observed and the instrumentation needs to improve to include the semantic invariant which guards this failure modality.";
                exceptionsList.push(
                    <DebuggerNodeRootCause key={i + "r"} node={node} />
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
