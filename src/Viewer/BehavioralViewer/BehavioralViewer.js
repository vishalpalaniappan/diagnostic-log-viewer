import React, {useContext, useRef} from "react";

import {DebugToolKit} from "../../Components/DebugToolKit/DebugToolKit";
import {FileViewer} from "../../Components/FileViewer/FileViewer";
import {TimelineContainer} from "../../Components/TimelineContainer/TimelineContainer";
import {StatusBarContainer} from "../StatusBarContainer/StatusBarContainer";
// eslint-disable-next-line max-len
import {LeftSideContainerBehavioral} from "./LeftContainer/LeftSideContainerBehavioral";
// eslint-disable-next-line max-len
import {RightSideContainerBehavioral} from "./RightContainer/RightSideContainerBehavioral";
import {SideMenu} from "./SideMenu/SideMenu";

import "./BehavioralViewer.scss";

/**
 * Renders the Behavioral Viewer.
 * @return {JSX.Element}
 */
export function BehavioralViewer () {
    const bodyContainerRef = useRef();
    const bodyContentContainerRef = useRef();
    const timelineContainerRef = useRef();

    return (
        <div className="viewer-container-behavioral">
            <DebugToolKit />
            <div className="menu-container-behavioral"></div>
            {/* Side menu */}
            <div className="side-menu-container-behavioral">
                <SideMenu />
            </div>
            {/* Body */}
            <div ref={bodyContainerRef} className="body-container-behavioral d-flex flex-column">
                {/* <div ref={bodyContentContainerRef} className="flex-grow-1"> */}
                <div className="w-100 h-100 d-flex flex-row">
                    {/* Left Side Container */}
                    <div className="d-flex h-100">
                        <LeftSideContainerBehavioral />
                    </div>
                    {/* Central Container */}
                    <div className="d-flex flex-grow-1 h-100 overflow-hidden">
                        <FileViewer/>
                    </div>
                    {/* Right Side Container */}
                    <div className="d-flex h-100">
                        <RightSideContainerBehavioral/>
                    </div>
                </div>
                {/* </div> */}
                {/* Timeline Container */}
                {/* <div ref={timelineContainerRef} style={{height: "250px"}}>
                    <TimelineContainer />
                </div> */}
            </div>
            {/* Status Bar */}
            <div className="status-bar-container-behavioral">
                <StatusBarContainer/>
            </div>
        </div>
    );
}
