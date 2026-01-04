import React, {useContext, useEffect, useRef, useState} from "react";

import TimelineContainerContext from "../TimelineContainerContext";

import "./TimelineTracksContainer.scss";

/**
 * Contains the timeline tracks container..
 * @return {JSX.Element}
 */
export function TimelineTracksContainer () {
    const {durations} = useContext(TimelineContainerContext);
    const timelineContainer = useRef();

    const PX_PER_SECOND = 200;

    useEffect(() => {
        if (durations) {
            timelineContainer.current.style.width = durations.max * PX_PER_SECOND + "px";
        }
    }, [durations]);

    return (
        <div className="timelineTracksContainer">
            <div className="timeline" ref={timelineContainer}>

            </div>
        </div>
    );
}

export default TimelineTracksContainer;
