import React, {useContext, useEffect, useRef, useState} from "react";

import TimelineContainerContext from "../TimelineContainerContext";

import "./TimelineTracksContainer.scss";

/**
 * Contains the timeline tracks container..
 * @return {JSX.Element}
 */
export function TimelineTracksContainer () {
    const {durations} = useContext(TimelineContainerContext);
    const timelineContainerRef = useRef();
    const timeTrackRef = useRef();
    const tracksContainerRef = useRef();
    const needleRef = useRef();

    const PX_PER_SECOND = 400;

    useEffect(() => {
        if (durations) {
            timelineContainerRef.current.style.width = durations.max * PX_PER_SECOND + "px";
            timeTrackRef.current.style.width = durations.max * PX_PER_SECOND + "px";

            const width = 1 * PX_PER_SECOND;
            needleRef.current.style.left = width + "px";

            const fullHeight = tracksContainerRef.current.getBoundingClientRect().height - 10;
            needleRef.current.style.height = fullHeight + "px";
        }
    }, [durations]);

    return (
        <div ref={tracksContainerRef} className="timelineTracksContainer d-flex flex-column">
            <div className="track-time-row" ref={timeTrackRef}>
                <div ref={needleRef} className="needle"></div>
            </div>
            <div className="timeline" ref={timelineContainerRef}>
            </div>
        </div>
    );
}

export default TimelineTracksContainer;
