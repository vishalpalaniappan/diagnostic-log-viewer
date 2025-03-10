import React, {useEffect, useRef} from "react";

import {OverviewContainer} from "./OverviewContainer/OverviewContainer";

import "./InfoContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function InfoContainer () {
    const infoContainerRef = useRef();
    const overviewContainerRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = infoContainerRef.current.clientHeight;
        const containerHeight = height;
        infoContainerRef.current.style.height = containerHeight + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={infoContainerRef} className="debug-container w-100 d-flex flex-column">
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Info</div>
            <div className="section" ref={overviewContainerRef}>
                <OverviewContainer />
            </div>
        </div>
    );
}
