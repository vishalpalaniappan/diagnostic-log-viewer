import React, {useContext, useEffect, useRef, useState} from "react";

import SegContext from "../../Providers/SegContext";
import { Bug } from "react-bootstrap-icons";

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
                seg[thread].forEach((entry) => {
                    if (entry.violations.length > 0) {
                        violationsFound.push(entry);
                    }
                });
            });
            console.log(violationsFound);
        }
    }, [seg]);

    return (
        <div className="w-100 h-100 automated-debugging-container">
            <div className="semantic-violation-row">
                <div className="violation-icon">
                    <Bug />
                </div>
                <div className="violation-content"></div>
            </div>
        </div>
    );
}
