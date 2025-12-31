import React, {useContext, useEffect, useRef, useState} from "react";

import {BreakPointContainer} from "../DebugContainer/BreakPointContainer/BreakPointContainer";
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
    const breakPointRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = semanticDebugContainerRef.current.clientHeight;
        const containerHeight = height - 150;
        breakPointRef.current.style.height = 150 - TITLE_HEIGHT + "px";
        segRef.current.style.height = containerHeight + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={semanticDebugContainerRef} className="debug-container w-100 d-flex flex-column">
            <div className="section" ref={segRef}>
                <SemanticExecutionGraph />
            </div>
            <VerticalHandle topDiv={segRef} bottomDiv={breakPointRef}/>
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Breakpoints</div>
            <div className="section" ref={breakPointRef}>
                <BreakPointContainer />
            </div>
        </div>
    );
}

