import React, {useEffect, useRef} from "react";

import {VerticleHandle} from "../VerticleHandle/VerticleHandle";
import {CallStackContainer} from "./CallStackContainer/CallStackContainer";
import {VariableStackContainer} from "./VariableStackContainer/VariableStackContainer";

import "./DebugContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function DebugContainer () {
    const debugContainerRef = useRef();
    const variableStackRef = useRef();
    const callStackRef = useRef();
    const breakPointsRef = useRef();

    const redrawContainers = () => {
        const height = debugContainerRef.current.clientHeight;
        const containerHeight = Math.floor(height/3) + "px";
        callStackRef.current.style.height = containerHeight;
        variableStackRef.current.style.height = containerHeight;
        breakPointsRef.current.style.height = containerHeight;
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={debugContainerRef} className="debug-container w-100 d-flex flex-column">
            <div className="section" ref={variableStackRef}>
                <VariableStackContainer />
            </div>
            <VerticleHandle topDiv={variableStackRef} bottomDiv={callStackRef}/>
            <div className="section" ref={callStackRef}>
                <CallStackContainer />
            </div>
            <VerticleHandle topDiv={callStackRef} bottomDiv={breakPointsRef}/>
            <div className="section" ref={breakPointsRef}>

            </div>
        </div>
    );
}
