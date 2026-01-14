import React, {useContext, useEffect, useState} from "react";

import BehaviorContext from "../../Providers/BehaviorContext";
// eslint-disable-next-line max-len
import { SemanticViolationRowBehavioral } from "./SemanticViolationRowBehavioral/SemanticViolationRowBehavioral";

import "./AutomatedDebuggingContainer.scss";

/**
 * Container for automated debugging information behavioral.
 * @return {JSX.Element}
 */
export function AutomatedDebuggingContainerBehavioral ({}) {
    const {behavior} = useContext(BehaviorContext);
    const [violations, setViolations] = useState();

    useEffect(() => {
        if (behavior) {
            const violationsFound = [];
            for (let i = 0; i < behavior.length; i++) {
                const entry = behavior[i];
                if (entry?.violation) {
                    for (let j = 0; j < entry.violation.length; j++) {
                        const violation = entry.violation[j];
                        violationsFound.push(
                            <SemanticViolationRowBehavioral
                                key={violation.module + "-" + violation.index}
                                violationIndex = {violation.index}
                                violation = {violation}
                                node = {entry}
                            />
                        );
                    }
                }
            }
            setViolations(violationsFound);
        }
    }, [behavior]);

    return (
        <div className="w-100 h-100 automated-debugging-container">
            {violations}
        </div>
    );
}
