import React, {useEffect, useRef} from "react";

// eslint-disable-next-line max-len
import {AutomatedDebuggingContainer} from "../AutomatedDebuggingContainer/AutomatedDebuggingContainer";
import {SemanticExecutionGraph} from "../SemanticExecutionGraph/SemanticExecutionGraph";
import {VerticalHandle} from "./VerticalHandle/VerticalHandle";

import "./SemanticDebugContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function SemanticDebugContainer () {
    const semanticDebugContainerRef = useRef();
    const segRef = useRef();
    const automatedDebugRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = semanticDebugContainerRef.current.clientHeight;
        const containerHeight = height - 150;
        automatedDebugRef.current.style.height = 150 - TITLE_HEIGHT + "px";
        segRef.current.style.height = containerHeight + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={semanticDebugContainerRef}
            className="semantic-debug-container w-100 d-flex flex-column">
            <div className="section" ref={segRef}>
                <SemanticExecutionGraph />
            </div>
            <VerticalHandle topDiv={segRef} bottomDiv={automatedDebugRef}/>
            <div className="w-100 violation-title" style={{height: TITLE_HEIGHT + "px"}}>
                Semantic Violations
            </div>
            <div className="section" ref={automatedDebugRef}>
                <AutomatedDebuggingContainer />
            </div>
        </div>
    );
}

