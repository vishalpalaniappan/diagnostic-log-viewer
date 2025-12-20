import React, {useEffect, useRef} from "react";

import DesignTree from "../DesignTree/DesignTree";
import {ExecutionTree} from "../ExecutionTree/ExecutionTree";
import {VerticalHandle} from "./VerticalHandle/VerticalHandle";

import "./AbstractionContainer.scss";

/**
 * Contains the abstraction information display.
 * @return {JSX.Element}
 */
export function AbstractionContainer () {
    const behaviorContainer = useRef();
    const abstractionContainerRef = useRef();
    const abstractionInfoContainerRef = useRef();

    const redrawContainers = () => {
        const height = abstractionContainerRef.current.clientHeight;
        const containerHeight = height - 500;
        behaviorContainer.current.style.height = 500 + "px";
        abstractionInfoContainerRef.current.style.height = containerHeight + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={abstractionContainerRef}
            className="abstraction-container w-100 d-flex flex-column">
            <div className="section" ref={behaviorContainer}>
                <DesignTree />
            </div>
            <VerticalHandle
                topDiv={behaviorContainer}
                bottomDiv={abstractionInfoContainerRef}/>
            <div className="section" ref={abstractionInfoContainerRef}>
                <ExecutionTree />
            </div>
        </div>
    );
}
