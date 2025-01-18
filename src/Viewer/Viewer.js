import React from "react";

import {DebugToolKit} from "../Components/DebugToolKit/DebugToolKit";
import {FileViewer} from "./FileViewer/FileViewer";
import {SideContainer} from "./SideContainer/SideContainer";

import "./Viewer.scss";

/**
 * Renders the diagnostic log viewer.
 * @return {JSX.Element}
 */
export function Viewer () {
    return (
        <div className="viewer-container">
            <DebugToolKit />
            <div className="menu-container">

            </div>
            <div className="body-container d-flex flex-row">
                <div className="d-flex h-100">
                    <SideContainer/>
                </div>
                <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                    <FileViewer/>
                </div>
            </div>
            <div className="status-bar-container">

            </div>
        </div>
    );
}
