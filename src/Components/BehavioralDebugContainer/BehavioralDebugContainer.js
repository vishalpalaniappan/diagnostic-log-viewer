import React, {useContext, useEffect, useRef, useState} from "react";

// eslint-disable-next-line max-len
import {AutomatedDebuggingContainer} from "../AutomatedDebuggingContainer/AutomatedDebuggingContainer";
import {BehavioralGraph} from "../BehavioralGraph/BehavioralGraph";
import {VerticalHandle} from "./VerticalHandle/VerticalHandle";

import "./BehavioralDebugContainer.scss";

/**
 * Contains the behavioral debug container.
 * @return {JSX.Element}
 */
export function BehavioralDebugContainer () {
    const behavioralDebugContainer = useRef();
    const segRef = useRef();
    const behavioralRef = useRef();
    const violationsRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = behavioralDebugContainer.current.clientHeight;
        const containerHeight = height - 150;
        violationsRef.current.style.height = 150 - TITLE_HEIGHT + "px";
        segRef.current.style.height = containerHeight/2 + "px";
        behavioralRef.current.style.height = containerHeight/2 + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={behavioralDebugContainer}
            className="semantic-debug-container w-100 d-flex flex-column">
            <div className="section" ref={behavioralRef}>
                <BehavioralGraph />
            </div>
            <VerticalHandle topDiv={behavioralRef} bottomDiv={segRef}/>
            <div className="section" ref={segRef}>
                <AutomatedDebuggingContainer />
            </div>
            <VerticalHandle topDiv={segRef} bottomDiv={violationsRef}/>
            <div className="w-100 violation-title" style={{height: TITLE_HEIGHT + "px"}}>
                Semantic Violations
            </div>
            <div className="section" ref={violationsRef}>
                <AutomatedDebuggingContainer />
            </div>
        </div>
    );
}

