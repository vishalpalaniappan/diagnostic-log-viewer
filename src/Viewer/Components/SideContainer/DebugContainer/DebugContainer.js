import React, {useRef} from "react";

import {VerticleHandle} from "../VerticleHandle/VerticleHandle";

import "./DebugContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function DebugContainer () {
    const variableStack = useRef();
    const callStack = useRef();
    const breakPoints = useRef();

    return (
        <div className="debug-container w-100 d-flex flex-column">
            <div className="section" ref={variableStack}>

            </div>
            <VerticleHandle topDiv={variableStack} bottomDiv={callStack}/>
            <div className="section" ref={callStack}>

            </div>
            <VerticleHandle topDiv={callStack} bottomDiv={breakPoints}/>
            <div className="section" ref={breakPoints}>

            </div>
        </div>
    );
}
