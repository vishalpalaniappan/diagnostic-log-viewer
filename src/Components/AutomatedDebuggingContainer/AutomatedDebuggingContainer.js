import React, {useContext, useEffect, useState} from "react";

import SegContext from "../../Providers/SegContext";
import {SemanticViolationRow} from "./SemanticViolationRow/SemanticViolationRow";

import "./AutomatedDebuggingContainer.scss";

/**
 * Container for automated debugging information.
 * @return {JSX.Element}
 */
export function AutomatedDebuggingContainer ({}) {
    const {seg} = useContext(SegContext);
    const [violations, setViolations] = useState();

    useEffect(() => {
        if (seg) {
            const violationsFound = [];
            const threads = Object.keys(seg);

            threads.forEach((thread) => {
                seg[thread].forEach((node, nodeIndex) => {
                    if (node.violations.length > 0) {
                        node.violations.forEach((violation, index) => {
                            violationsFound.push(
                                <SemanticViolationRow
                                    key={nodeIndex + "-" + index}
                                    violationIndex = {index}
                                    violation = {violation}
                                    node = {node}
                                />
                            );
                        });
                    }
                });
            });
            setViolations(violationsFound);
        }
    }, [seg]);

    return (
        <div className="w-100 h-100 automated-debugging-container">
            {violations}
        </div>
    );
}
