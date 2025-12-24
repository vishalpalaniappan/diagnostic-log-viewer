import React, {useContext, useEffect, useRef} from "react";

import ExecutionTreeContext from "../../Providers/ExecutionTreeContext";
import DesignTree from "../DesignTree/DesignTree";
import {ExecutionTree} from "../ExecutionTree/ExecutionTree";
import {RootCauseContainer} from "./RootCauseContainer/RootCauseContainer";
import {VerticalHandle} from "./VerticalHandle/VerticalHandle";

import "./AbstractionContainer.scss";

/**
 * Contains the abstraction information display.
 * @return {JSX.Element}
 */
export function AbstractionContainer () {
    const {rootCauses} = useContext(ExecutionTreeContext);
    const behaviorContainer = useRef();
    const abstractionContainerRef = useRef();
    const abstractionInfoContainerRef = useRef();
    const rootCauseContainer = useRef();

    const redrawContainers = () => {
        const height = abstractionContainerRef.current.clientHeight;
        if (rootCauses && rootCauses.length > 0) {
            const containerHeight = height - 550;
            behaviorContainer.current.style.height = 400 + "px";
            rootCauseContainer.current.style.height = 150 + "px";
            abstractionInfoContainerRef.current.style.height = containerHeight + "px";
        } else {
            const containerHeight = height - 500;
            behaviorContainer.current.style.height = 500 + "px";
            abstractionInfoContainerRef.current.style.height = containerHeight + "px";
        }
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
            {
                (rootCauses && rootCauses.length > 0) ?
                    <>
                        <VerticalHandle
                            topDiv={behaviorContainer}
                            bottomDiv={rootCauseContainer}/>
                        <div className="section" ref={rootCauseContainer}>
                            <RootCauseContainer />
                        </div>
                        <VerticalHandle
                            topDiv={rootCauseContainer}
                            bottomDiv={abstractionInfoContainerRef}/>
                        <div className="section" ref={abstractionInfoContainerRef}>
                            <ExecutionTree />
                        </div>
                    </>:
                    <>
                        <VerticalHandle
                            topDiv={behaviorContainer}
                            bottomDiv={abstractionInfoContainerRef}/>
                        <div className="section" ref={abstractionInfoContainerRef}>
                            <ExecutionTree />
                        </div>
                    </>
            }
        </div>
    );
}
