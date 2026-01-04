import React, {useContext} from "react";

import {CentralContainer} from "../Components/CentralContainer/CentralContainer";
import {DebugToolKit} from "../Components/DebugToolKit/DebugToolKit";
import PROGRAM_STATE from "../PROGRAM_STATE";
import ActionsContext from "../Providers/ActionsContext";
import {RightSideContainer} from "./RightSideContainer/RightSideContainer";
import {SideContainerBehavioral} from "./SideContainer/SideContainerBehavioral";
import {SideContainerGraph} from "./SideContainer/SideContainerGraph";
import {SideContainerStack} from "./SideContainer/SideContainerStack";
import {StatusBarContainer} from "./StatusBarContainer/StatusBarContainer";

import "./Viewer.scss";

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
                    <CentralContainer/>
                </div>
            </div>
            <div className="status-bar-container">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
