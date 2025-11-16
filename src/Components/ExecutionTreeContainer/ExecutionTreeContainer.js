import React, {useContext, useEffect, useRef, useState} from "react";

import ReactJsonView from "@microlink/react-json-view";

import ExecutionTreeContext from "../../Providers/ExecutionTreeContext";

import "./ExecutionTreeContainer.scss";

/**
 * @return {JSX.Element}
 */
export function ExecutionTreeContainer ({}) {
    const executionTreeContainer = useRef();
    const uiOptions = useRef();

    const variableStackTheme = {
        base00: "#252526",
        base01: "#ddd",
        base02: "#474747",
        base03: "#444",
        base04: "#717171",
        base05: "#444",
        base06: "#444",
        base07: "#c586c0", // keys
        base08: "#444",
        base09: "#ce9178", // String
        base0A: "rgba(70, 70, 230, 1)",
        base0B: "#ce9178",
        base0C: "rgba(70, 70, 230, 1)",
        base0D: "#bbb18c", // indent arrow
        base0E: "#bbb18c", // indent arrow
        base0F: "#a7ce8a",
    };

    const TITLE_HEIGHT = 20;

    const {executionTree} = useContext(ExecutionTreeContext);
    const [mappedExecutionTree, setMappedExecutionTree] = useState();

    const redrawContainers = () => {
        const height = executionTreeContainer.current.clientHeight;
        uiOptions.current.style.height = height - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    useEffect(() => {
        console.log("Execution Tree updated:", executionTree);
        setMappedExecutionTree(executionTree);
    }, [executionTree]);

    return (
        <div ref={executionTreeContainer} className="w-100 h-100 execution-tree-container">
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>
                Execution Tree
            </div>
            <div ref={uiOptions} className="w-100">
                <ReactJsonView
                    src={mappedExecutionTree}
                    theme={variableStackTheme}
                    collapsed={1}
                    name={"local"}
                    groupArraysAfterLength={100}
                    sortKeys={true}
                    displayDataTypes={false}
                    quotesOnKeys={true}
                    collapseStringsAfterLength={30}>
                </ReactJsonView>
            </div>
        </div>
    );
}
