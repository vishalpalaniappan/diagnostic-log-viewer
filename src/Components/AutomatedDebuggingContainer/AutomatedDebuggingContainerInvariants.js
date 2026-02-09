import React, {useContext, useEffect, useState} from "react";

import BehaviorContext from "../../Providers/BehaviorContext";
import {DebuggerNodeInvariant} from "./DebuggerNodeInvariant/DebuggerNodeInvariant";

import "./AutomatedDebuggingContainer.scss";

/**
 * Container for automated debugging about invariants.
 * @return {JSX.Element}
 */
export function AutomatedDebuggingContainerInvariants ({}) {
    const {behavior} = useContext(BehaviorContext);
    const [rows, setRows] = useState();

    useEffect(() => {
        if (behavior) {
            const debug = behavior.debugger;
            const invariants = debug.invariantViolations.concat(debug.availabilityViolations);
            processInvariants(invariants);
        }
    }, [behavior]);

    /**
     * Proces the exceptions in the file.
     * @param {Array} invariants
     */
    const processInvariants = (invariants) => {
        const invariantsList = [];
        for (let i = 0; i < invariants.length; i++) {
            const node = {...invariants[i]};
            node.level = 0;
            node.text = node.violation.violationSentence;
            invariantsList.push(
                <DebuggerNodeInvariant key={i} node={node} />
            );
        }
        setRows(invariantsList);
    };

    return (
        <div className="debuggingContainer">
            <div className="topContainerDebugger">
                <div className="titleContainerDebugger">
                    <span className="titleDebugger">
                        Automated Debugging Container - Invariant Violations
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
