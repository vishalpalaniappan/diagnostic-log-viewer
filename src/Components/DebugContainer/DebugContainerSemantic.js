import React, {useEffect, useRef} from "react";

import {BreakPointContainer} from "./BreakPointContainer/BreakPointContainer";
import {CallStackContainer} from "./CallStackContainer/CallStackContainer";
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
    const breakPointRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = debugContainerRef.current.clientHeight;
        const containerHeight = height - 150;
        breakPointRef.current.style.height = 150 - TITLE_HEIGHT + "px";
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
            <VerticalHandle topDiv={variableStackRef} bottomDiv={breakPointRef}/>
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Breakpoints</div>
            <div className="section" ref={breakPointRef}>
                <BreakPointContainer />
            </div>
        </div>
    );
}
