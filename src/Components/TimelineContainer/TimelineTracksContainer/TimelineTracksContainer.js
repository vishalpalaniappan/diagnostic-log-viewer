import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

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
            const roundedDuration = Math.ceil(durations.max);
            timelineContainerRef.current.style.width = roundedDuration * PX_PER_SECOND + "px";
            timeTrackRef.current.style.width = roundedDuration * PX_PER_SECOND + "px";

            const left = 1 * PX_PER_SECOND + 15;
            needleRef.current.style.left = left + "px";

            const fullHeight = tracksContainerRef.current.getBoundingClientRect().height - 10;
            needleRef.current.style.height = fullHeight + "px";
        }
    }, [durations]);

    // Renders the time tracks
    const getTimeTracks = () => {
        if (durations) {
            const ticks = [];
            for (let i = 0; i < Math.ceil(durations.max); i++) {
                const left = (PX_PER_SECOND * i) + "px";
                ticks.push(
                    <span className="trackLabel"
                        key={i}
                        style={{"left": left}}>
                        {i}
                    </span>
                );
            }
            return ticks;
        }
    };

    const downValueX = useRef();
    const handleMouseDown = (e) => {
        console.log("Mouse Down");
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        downValueX.current = e.clientX;
    };

    const handleMouseMove = useCallback((e) => {
        const delta = e.clientX - downValueX.current;
        console.log("Mouse Move", delta);
    }, []);

    const handleMouseUp = useCallback((e) => {
        console.log("Mouse Up");
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }, []);

    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <div ref={tracksContainerRef} className="timelineTracksContainer d-flex flex-column">
            <div ref={needleRef} onMouseDown={handleMouseDown} className="needle">
                <div className="needle-handle"></div>
            </div>
            <div className="track-time-row" ref={timeTrackRef}>
                {getTimeTracks()}
            </div>
            <div className="timeline" ref={timelineContainerRef}>
                <div className="track-time-row">
                    <div className="track-actor" style={{left: "15px", width: "100px"}}></div>
                </div>
                <div className="track-time-row">
                    <div className="track-actor" style={{left: "115px", width: "80px"}}></div>
                </div>
                <div className="track-time-row">
                    <div className="track-actor" style={{left: "115px", width: "80px"}}></div>
                </div>
                <div className="track-time-row">
                    <div className="track-actor" style={{left: "115px", width: "80px"}}></div>
                </div>
            </div>
        </div>
    );
}

export default TimelineTracksContainer;
