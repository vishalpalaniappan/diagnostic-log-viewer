import React, {useContext, useEffect, useRef, useState} from "react";

import StackContext from "../../Providers/StackContext";
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
    const {stacks, activeThread, setActiveThread} = useContext(StackContext);
    const [graph, setGraph] = useState();

    const centralContainerRef = useRef();
    const viewerRef = useRef();
    const flowRef = useRef();

    const redrawContainers = () => {
        const height = centralContainerRef.current.clientHeight;
        const containerHeight = height - 200 - 21;
        viewerRef.current.style.height = containerHeight + "px";
        flowRef.current.style.height = 200 + "px";
    };

    useEffect(() => {
        // if (stacks) {
        //     const stack = stacks[activeThread].stack;
        //     const designFlow = stack.designFlow;

        //     // Flatten design flow
        //     let path = [];
        //     designFlow.forEach((level, index) => {
        //         path = path.concat(level);
        //     });

        //     // Create flow graph object
        //     const obj = {
        //         "orientation": "TB",
        //         "data": {
        //             "path": path,
        //         },
        //     };
        //     // Set graph state
        //     setGraph(obj);
        // }
    }, [stacks]);

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
                {/* <FlowDiagram treeInfo={graph}/> */}
            </div>
        </div>
    );
}
