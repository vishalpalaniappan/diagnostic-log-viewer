import React, {useEffect, useRef} from "react";

import {CallStackContainer} from "./CallStackContainer/CallStackContainer";
import {VariableStackContainer} from "./VariableStackContainer/VariableStackContainer";
import {VerticleHandle} from "./VerticleHandle/VerticleHandle";

import "./DebugContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function DebugContainer () {
    const debugContainerRef = useRef();
    const variableStackRef = useRef();
    const callStackRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = debugContainerRef.current.clientHeight;
        const containerHeight = height - 200;
        callStackRef.current.style.height = 200 - TITLE_HEIGHT + "px";
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
            <VerticleHandle topDiv={variableStackRef} bottomDiv={callStackRef}/>
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Call Stack</div>
            <div className="section" ref={callStackRef}>
                <CallStackContainer />
            </div>
        </div>
    );
}
