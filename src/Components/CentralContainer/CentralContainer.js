import React, {useContext, useEffect, useRef, useState} from "react";

import {MonacoInstance} from "../MonacoInstance/MonacoInstance";
import {Tabs} from "../Tabs/Tabs";
import {VerticalHandle} from "./VerticalHandle/VerticalHandle";

import "./CentralContainer.scss";

/**
 * Contains the viewer an flow.
 * @return {JSX.Element}
 */
export function CentralContainer () {
    const centralContainerRef = useRef();
    const viewerRef = useRef();
    const flowRef = useRef();

    const redrawContainers = () => {
        const height = centralContainerRef.current.clientHeight;
        const containerHeight = height - 200 - 47;
        viewerRef.current.style.height = containerHeight + "px";
        flowRef.current.style.height = 200 + "px";
    };
    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={centralContainerRef} className="central-container w-100 d-flex flex-column">
            <Tabs />
            <div className="section" ref={viewerRef}>
                <MonacoInstance/>
            </div>
            <VerticalHandle topDiv={viewerRef} bottomDiv={flowRef}/>
            <div className="section" ref={flowRef}>
            </div>
        </div>
    );
}
