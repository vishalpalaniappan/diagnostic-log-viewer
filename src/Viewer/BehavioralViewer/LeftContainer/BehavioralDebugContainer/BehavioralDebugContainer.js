import React, {useContext, useEffect, useRef, useState} from "react";

// eslint-disable-next-line max-len
import {BehavioralExecutionTree} from "../../../../Components/BehavioralExecutionTree/BehavioralExecutionTree";
import {BehavioralGraph} from "../../../../Components/BehavioralGraph/BehavioralGraph";
import { VerticalHandle } from "../../../../Components/VerticalHandle/VerticalHandle";

import "./BehavioralDebugContainer.scss";

/**
 * Contains the behavioral debug container.
 * @return {JSX.Element}
 */
export function BehavioralDebugContainer () {
    const behavioralDebugContainer = useRef();
    const behavioralRef = useRef();
    const violationsRef = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = behavioralDebugContainer.current.clientHeight;
        const containerHeight = height;
        violationsRef.current.style.height = 200 + "px";
        behavioralRef.current.style.height = containerHeight - 200 + "px";
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
            <VerticalHandle topDiv={behavioralRef} bottomDiv={violationsRef}/>
            <div className="section" ref={violationsRef}>
                <BehavioralExecutionTree />
            </div>
        </div>
    );
}

