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
    const tracksContainerRef = useRef();
    const needleRef = useRef();

    const PX_PER_SECOND = 200;

    useEffect(() => {
        if (durations) {
            timelineContainerRef.current.style.width = durations.max * PX_PER_SECOND + "px";

            const width = durations.max * PX_PER_SECOND;
            needleRef.current.style.left = width/2 + "px";

            const fullHeight = tracksContainerRef.current.getBoundingClientRect().height;
            needleRef.current.style.height = fullHeight + "px";
        }
    }, [durations]);

    return (
        <div ref={tracksContainerRef} className="timelineTracksContainer">
            <div className="timeline" ref={timelineContainerRef}>
                <div className="track-time-row">
                    <div ref={needleRef} className="needle"></div>
                </div>
            </div>
        </div>
    );
}

export default TimelineTracksContainer;
