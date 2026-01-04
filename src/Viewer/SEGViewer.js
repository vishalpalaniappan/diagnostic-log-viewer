import React, {useContext} from "react";

import {CentralContainer} from "../Components/CentralContainer/CentralContainer";
import {DebugToolKit} from "../Components/DebugToolKit/DebugToolKit";
import {RightSideContainer} from "./RightSideContainer/RightSideContainer";
import {SideContainerGraph} from "./SideContainer/SideContainerGraph";
import {StatusBarContainer} from "./StatusBarContainer/StatusBarContainer";

import "./Viewer.scss";

/**
 * Renders the SEG Viewer.
 * @return {JSX.Element}
 */
export function SEGViewer () {
    return (
        <div className="viewer-container">
            <DebugToolKit />
            <div className="menu-container"></div>
            <div className="body-container d-flex flex-row">
                <div className="d-flex h-100">
                    <SideContainerGraph />;
                </div>
                <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                    <CentralContainer/>
                </div>
                <RightSideContainer/>;
            </div>
            <div className="status-bar-container">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
