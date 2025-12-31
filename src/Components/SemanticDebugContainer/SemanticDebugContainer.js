import React, {useContext, useEffect, useRef, useState} from "react";

import {SemanticExecutionGraph} from "../SemanticExecutionGraph/SemanticExecutionGraph";
import {VerticalHandle} from "./VerticalHandle/VerticalHandle";

import "./SemanticDebugContainer.scss";

/**
 * Contains the semantic debug container with the SEG and
 * automated debugging information.
 * @return {JSX.Element}
 */
export function SemanticDebugContainer () {
    const semanticDebugContainerRef = useRef();
    const segRef = useRef();
    const flowRef = useRef();

    const redrawContainers = () => {
        const height = semanticDebugContainerRef.current.clientHeight;
        const containerHeight = height;
        segRef.current.style.height = containerHeight + "px";
        // flowRef.current.style.height = 250 + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={semanticDebugContainerRef}
            className="semantic-debug-container w-100 d-flex flex-column">
            <div className="flex-grow-1" ref={segRef}>
                <SemanticExecutionGraph/>
            </div>
            {/* <VerticalHandle topDiv={segRef} bottomDiv={flowRef}/>
            <div ref={flowRef}>
            </div> */}
        </div>
    );
}
