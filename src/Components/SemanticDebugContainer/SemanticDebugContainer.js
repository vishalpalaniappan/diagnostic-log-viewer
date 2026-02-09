import React, {useEffect, useRef} from "react";

// eslint-disable-next-line max-len
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

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = semanticDebugContainerRef.current.clientHeight;
        const containerHeight = height;
        segRef.current.style.height = containerHeight + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={semanticDebugContainerRef}
            className="semantic-debug-container w-100 d-flex flex-column">
            <div className="section" ref={segRef}>
                <SemanticExecutionGraph />
            </div>
        </div>
    );
}

