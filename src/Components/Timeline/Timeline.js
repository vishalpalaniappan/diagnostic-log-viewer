import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";

import "./Timeline.scss";

/**
 * Renders the Timeline.
 * @return {JSX.Element}
 */
export function Timeline ({}) {
    const timelineRef = useRef();
    const needleRef = useRef();
    const handleRef = useRef();

    const [unit, setUnit] = useState();
    const [duration, setDuration] = useState();

    const startTime = useRef(1765539235403);
    const endTime = useRef(1765539275107);

    const PIXELS_PER_UNIT = 30;

    useEffect(() => {
        const startTimeDate = new Date(startTime.current);
        const endTimeDate = new Date(endTime.current);
        const seconds = (endTimeDate.getTime() - startTimeDate.getTime()) / 1000;

        setDuration(seconds);
        setUnit("seconds");

        const width = seconds * PIXELS_PER_UNIT;
        timelineRef.current.style.width = width + "px";

        needleRef.current.style.left = width/2 + "px";
        handleRef.current.style.left = width/2 + "px";
        setNeedle(1765539240107);
    }, []);


    const setNeedle = (time) => {
        const startTimeDate = new Date(startTime.current);
        const currTimeDate = new Date(time);

        const delta = (currTimeDate.getTime() - startTimeDate.getTime()) / 1000;

        const xPos = delta * PIXELS_PER_UNIT;
        handleRef.current.style.left = xPos + "px";
        needleRef.current.style.left = xPos + "px";
    };

    return (
        <div className="outer-container">
            <div className="timeline-container" ref={timelineRef}>
                <div className="timeslot">
                    <div ref={handleRef} className="needle-handle"></div>
                </div>

                <div className="track">
                    <div ref={needleRef} className="needle"></div>
                </div>

            </div>
        </div>
    );
}
