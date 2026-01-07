import React, {useContext, useRef} from "react";

import {DebugToolKit} from "../../Components/DebugToolKit/DebugToolKit";
import {FileViewer} from "../../Components/FileViewer/FileViewer";
import TimelineContainer from "../../Components/TimelineContainer/TimelineContainer";
import {SideMenu} from "../BehavioralViewer/SideMenu/SideMenu";
import {StatusBarContainer} from "../StatusBarContainer/StatusBarContainer";
import {SideContainerGraph} from "./LeftContainer/SideContainerGraph";
import {RightSideContainer} from "./RightContainer/RightSideContainer";

import "./SEGViewer.scss";

/**
 * Renders the SEG Viewer.
 * @return {JSX.Element}
 */
export function SEGViewer () {
    const bodyContainerRef = useRef();
    const bodyContentContainerRef = useRef();
    const timelineContainerRef = useRef();

    return (
        <div className="viewer-container-seg">
            <DebugToolKit />
            <div className="menu-container-seg"></div>
            {/* Side menu */}
            <div className="side-menu-container-behavioral">
                <SideMenu />
            </div>
            {/* Body */}
            <div ref={bodyContainerRef} className="body-container-seg d-flex flex-column">
                <div ref={bodyContentContainerRef} className="flex-grow-1">
                    <div className="w-100 h-100 d-flex flex-row">
                        {/* Left Side Container */}
                        <div className="d-flex h-100">
                            <SideContainerGraph />
                        </div>
                        {/* Central Container */}
                        <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                            <FileViewer/>
                        </div>
                        {/* Right Side Container */}
                        <div className="d-flex h-100">
                            <RightSideContainer/>
                        </div>
                    </div>
                </div>
                {/* Timeline Container */}
                {/* <div ref={timelineContainerRef} style={{height: "250px"}}>
                    <TimelineContainer />
                </div> */}
            </div>
            {/* Status Bar */}
            <div className="status-bar-container-seg">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
