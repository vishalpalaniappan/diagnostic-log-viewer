import React from "react";

import {DebugToolKit} from "../../Components/DebugToolKit/DebugToolKit";
import {FileViewer} from "../FileViewer/FileViewer";
import {StatusBarContainer} from "../StatusBarContainer/StatusBarContainer";
import {SideContainerStack} from "./LeftContainer/SideContainerStack";

import "./StackViewer.scss";

/**
 * Renders the Stack Viewer.
 * @return {JSX.Element}
 */
export function StackViewer () {
    return (
        <div className="viewer-container">
            <DebugToolKit />
            <div className="menu-container"></div>
            <div className="body-container d-flex flex-row">
                <div className="d-flex h-100">
                    <SideContainerStack />
                </div>
                <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                    <FileViewer/>
                </div>
            </div>
            <div className="status-bar-container">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
