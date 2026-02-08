import React, {useEffect, useRef} from "react";

import BehavioralExecutionTree from "../../../../Components/BehavioralExecutionTree/BehavioralExecutionTree";
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
    const executionTreeRef = useRef();
    const variableStackRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = debugContainerRef.current.clientHeight;
        const containerHeight = height;
        executionTreeRef.current.style.height = 150 + "px";
        variableStackRef.current.style.height = containerHeight - 150 - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={debugContainerRef} className="debug-container w-100 d-flex flex-column">
            <div className="section" ref={executionTreeRef}>
                <BehavioralExecutionTree />
            </div>
            <VerticalHandle topDiv={executionTreeRef} bottomDiv={variableStackRef}/>
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Variables</div>
            <div className="section" ref={variableStackRef}>
                <VariableStackContainer />
            </div>
        </div>
    );
}
