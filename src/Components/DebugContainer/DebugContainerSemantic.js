import React, {useEffect, useRef} from "react";

// eslint-disable-next-line max-len
import {AutomatedDebuggingContainer} from "../AutomatedDebuggingContainer/AutomatedDebuggingContainer";
import {VariableStackContainer} from "./VariableStackContainer/VariableStackContainer";
import {VerticalHandle} from "./VerticalHandle/VerticalHandle";

import "./DebugContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function DebugContainerSemantic () {
    const debugContainerRef = useRef();
    const variableStackRef = useRef();
    const automatedDebuggingRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = debugContainerRef.current.clientHeight;
        const containerHeight = height - 300;
        automatedDebuggingRef.current.style.height = 300 - TITLE_HEIGHT + "px";
        variableStackRef.current.style.height = containerHeight - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={debugContainerRef} className="debug-container w-100 d-flex flex-column">
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Variables</div>
            <div className="section" ref={variableStackRef}>
                <VariableStackContainer />
            </div>
            <VerticalHandle topDiv={variableStackRef} bottomDiv={automatedDebuggingRef}/>
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>
                Semantic Violations
            </div>
            <div className="section" ref={automatedDebuggingRef}>
                <AutomatedDebuggingContainer />
            </div>
        </div>
    );
}
