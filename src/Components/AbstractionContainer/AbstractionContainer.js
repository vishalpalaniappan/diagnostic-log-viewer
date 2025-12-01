import React, {useEffect, useRef} from "react";

import { ExecutionTree } from "../ExecutionTree/ExecutionTree";
import {VerticalHandle} from "./VerticalHandle/VerticalHandle";

import "./AbstractionContainer.scss";

/**
 * Contains the abstraction information display.
 * @return {JSX.Element}
 */
export function AbstractionContainer () {
    const abstractionContainerRef = useRef();
    const abstractionInfoContainerRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = abstractionContainerRef.current.clientHeight;
        const containerHeight = height;
        abstractionInfoContainerRef.current.style.height = containerHeight + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={abstractionContainerRef}
            className="abstraction-container w-100 d-flex flex-column">
            <div className="section" ref={abstractionInfoContainerRef}>
                <ExecutionTree />
            </div>
        </div>
    );
}
