import React, {useContext, useEffect, useRef, useState} from "react";

import PathsContext from "../../Providers/PathsContext";
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
    const {paths} = useContext(PathsContext);
    const [graph, setGraph] = useState();

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
        if (paths) {
            const obj = {
                "orientation": "TB",
                "data": paths,
            };
            setGraph(obj);
        }
    }, [paths]);

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
                <FlowDiagram treeInfo={graph}/>
            </div>
        </div>
    );
}
