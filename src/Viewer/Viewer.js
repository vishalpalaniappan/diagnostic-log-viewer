import React, {useContext, useEffect, useState} from "react";

import {DebugToolKit} from "../Components/DebugToolKit/DebugToolKit";
import ExecutionTreeContext from "../Providers/ExecutionTreeContext";
import {FileViewer} from "./FileViewer/FileViewer";
import {RightSideContainer} from "./RightSideContainer/RightSideContainer";
import {SideContainer} from "./SideContainer/SideContainer";
import {StatusBarContainer} from "./StatusBarContainer/StatusBarContainer";

import "./Viewer.scss";

/**
 * Renders the Diagnostic Log Viewer.
 * @return {JSX.Element}
 */
export function Viewer () {
    const {executionTree} = useContext(ExecutionTreeContext);
    const [showExecutionTree, setShowExecutionTree] = useState(false);

    useEffect(() => {
        if (executionTree) {
            setShowExecutionTree(true);
        } else {
            setShowExecutionTree(false);
        }
    }, [executionTree]);

    return (
        <div className="viewer-container">
            { showExecutionTree ?
                <></>:
                <DebugToolKit />
            }
            <div className="menu-container"></div>
            <div className="body-container d-flex flex-row">
                <div className="d-flex h-100">
                    <SideContainer/>
                </div>
                <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                    <FileViewer/>
                </div>
                { showExecutionTree ?
                    <div className="d-flex h-100">
                        <RightSideContainer/>
                    </div>:
                    <></>
                }
            </div>
            <div className="status-bar-container">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
