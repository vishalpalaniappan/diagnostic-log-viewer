import React, {useEffect, useRef} from "react";

import {FlowDiagram} from "../FlowDiagram/FlowDiagram";
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
        const containerHeight = height/2 - 21;
        viewerRef.current.style.height = containerHeight + "px";
        flowRef.current.style.height = containerHeight + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    const a = {
        "orientation": "TB",
        "data": {
            "branch1" : ["a", "b", "c", "p"],
            "branch2" : ["a", "b", "d", "x"],
            "branch3" : ["a", "f", "g", "x"]
        }
    };

    return (
        <div ref={centralContainerRef} className="central-container w-100 d-flex flex-column">
            <Tabs />
            <div className="section" ref={viewerRef}>
                <MonacoInstance/>
            </div>
            <VerticalHandle topDiv={viewerRef} bottomDiv={flowRef}/>
            <div className="section" ref={flowRef}>
                <FlowDiagram treeInfo={a}/>
            </div>
        </div>
    );
}
