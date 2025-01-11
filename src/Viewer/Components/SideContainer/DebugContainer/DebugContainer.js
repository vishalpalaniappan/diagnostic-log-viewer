import React, {useRef} from "react";

import {Handle} from "./Handle";

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
            <Handle topDiv={variableStack} bottomDiv={callStack}/>
            <div className="section" ref={callStack}>

            </div>
            <Handle topDiv={callStack} bottomDiv={breakPoints}/>
            <div className="section" ref={breakPoints}>

            </div>
        </div>
    );
}
