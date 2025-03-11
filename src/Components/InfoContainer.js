import React, {useEffect, useRef} from "react";

import {OverviewContainer} from "./OverviewContainer/OverviewContainer";
import {VariableMapContainer} from "./VariableMapContainer/VariableMapContainer";
import {LogTypeMapContainer} from "./LogTypeMapContainer/LogTypeMapContainer";

import {VerticleHandle} from "../DebugContainer/VerticleHandle/VerticleHandle";

import "./InfoContainer.scss";

/**
 * Contains the debugger accordian sections.
 * @return {JSX.Element}
 */
export function InfoContainer () {
    const infoContainerRef = useRef();
    const overviewRef = useRef();
    const varMapRef = useRef();
    const logTypeRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = infoContainerRef.current.clientHeight;
        const containerHeight = height/3;
        overviewRef.current.style.height = containerHeight - TITLE_HEIGHT + "px";
        varMapRef.current.style.height = containerHeight - TITLE_HEIGHT + "px";
        logTypeRef.current.style.height = containerHeight - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={infoContainerRef} className="debug-container w-100 d-flex flex-column">
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>
                CDL Header Statistics
            </div>
            <div className="section" ref={overviewRef}>
                <OverviewContainer />
            </div>
            <VerticleHandle topDiv={overviewRef} bottomDiv={varMapRef}/>
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Variable Map</div>
            <div className="section" ref={varMapRef}>
                <VariableMapContainer />
            </div>
            <VerticleHandle topDiv={varMapRef} bottomDiv={logTypeRef}/>
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>Logtype Map</div>
            <div className="section" ref={logTypeRef}>
                <LogTypeMapContainer />
            </div>
        </div>
    );
}
