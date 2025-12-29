import React, {useContext} from "react";

import {CentralContainer} from "../Components/CentralContainer/CentralContainer";
import {DebugToolKit} from "../Components/DebugToolKit/DebugToolKit";
import PROGRAM_STATE from "../PROGRAM_STATE";
import ActionsContext from "../Providers/ActionsContext";
import {RightSideContainer} from "./RightSideContainer/RightSideContainer";
import {SideContainerGraph} from "./SideContainer/SideContainerGraph";
import {SideContainerStack} from "./SideContainer/SideContainerStack";
import {StatusBarContainer} from "./StatusBarContainer/StatusBarContainer";

import "./Viewer.scss";

/**
 * Renders the Diagnostic Log Viewer.
 * @return {JSX.Element}
 */
export function Viewer () {
    const {mode} = useContext(ActionsContext);

    const getToolKit = () => {
        if (mode === PROGRAM_STATE.STACK) {
            return <DebugToolKit />;
        } else if (mode === PROGRAM_STATE.SEG) {
            return <DebugToolKit />;
        }
    };

    const getSideContainer = () => {
        if (mode === PROGRAM_STATE.STACK) {
            return <SideContainerStack />;
        } else if (mode === PROGRAM_STATE.SEG) {
            return <SideContainerGraph />;
        }
    };

    const getRightSideContainer = () => {
        if (mode === PROGRAM_STATE.SEG) {
            return <RightSideContainer/>;
        }
    };

    return (
        <div className="viewer-container">
            {getToolKit()}
            <div className="menu-container"></div>
            <div className="body-container d-flex flex-row">
                <div className="d-flex h-100">
                    {getSideContainer()}
                </div>
                <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                    <CentralContainer/>
                </div>
                { getRightSideContainer()}
            </div>
            <div className="status-bar-container">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
