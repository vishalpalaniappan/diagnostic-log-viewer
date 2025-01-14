import React, {useRef} from "react";

import {VerticleHandle} from "../VerticleHandle/VerticleHandle";
import {VariableStackContainer} from "./VariableStackContainer/VariableStackContainer";

import "./DebugContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function DebugContainer () {
    const variableStackRef = useRef();
    const callStackRef = useRef();
    const breakPointsRef = useRef();

    return (
        <div className="debug-container w-100 d-flex flex-column">
            <div className="section" ref={variableStackRef}>
                <VariableStackContainer />
            </div>
            <VerticleHandle topDiv={variableStackRef} bottomDiv={callStackRef}/>
            <div className="section" ref={callStackRef}>

            </div>
            <VerticleHandle topDiv={callStackRef} bottomDiv={breakPointsRef}/>
            <div className="section" ref={breakPointsRef}>

            </div>
        </div>
    );
}
