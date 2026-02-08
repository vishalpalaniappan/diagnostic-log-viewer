import React, {useEffect, useRef} from "react";

// eslint-disable-next-line max-len
import { AutomatedDebuggingContainer } from "../../../../Components/AutomatedDebuggingContainer/AutomatedDebuggingContainer";
// eslint-disable-next-line max-len
import {VariableStackContainer} from "../../../../Components/VariableStackContainer/VariableStackContainer";
import {VerticalHandle} from "../../../../Components/VerticalHandle/VerticalHandle";

import "./DebugContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function DebugContainerSemantic () {
    const debugContainerRef = useRef();
    const automatedDebuggingContainer = useRef();
    const variableStackRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = debugContainerRef.current.clientHeight;
        const containerHeight = height;
        automatedDebuggingContainer.current.style.height = 400 + "px";
        variableStackRef.current.style.height = containerHeight - 400 - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={debugContainerRef} className="debug-container w-100 d-flex flex-column">
            <div className="section" ref={automatedDebuggingContainer}>
                <AutomatedDebuggingContainer />
            </div>
            <VerticalHandle topDiv={automatedDebuggingContainer} bottomDiv={variableStackRef}/>
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Variables</div>
            <div className="section" ref={variableStackRef}>
                <VariableStackContainer />
            </div>
        </div>
    );
}
