import React, {useContext} from "react";

import {DebugToolKit} from "../../Components/DebugToolKit/DebugToolKit";
import {FileViewer} from "../FileViewer/FileViewer";
import {StatusBarContainer} from "../StatusBarContainer/StatusBarContainer";
import {RightSideContainer} from "./RightContainer/RightSideContainer";
import {SideContainerGraph} from "./LeftContainer/SideContainerGraph";

import "./SEGViewer.scss";

/**
 * Renders the SEG Viewer.
 * @return {JSX.Element}
 */
export function SEGViewer () {
    return (
        <div className="viewer-container">
            <DebugToolKit />
            <div className="menu-container"></div>
            <div className="body-container w-100 d-flex flex-row">
                <div className="d-flex h-100">
                    <SideContainerGraph />;
                </div>
                <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                    <FileViewer/>
                </div>
                <div className="d-flex h-100">
                    <RightSideContainer/>;
                </div>
            </div>
            <div className="status-bar-container">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
