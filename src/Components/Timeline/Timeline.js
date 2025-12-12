import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import ExecutionTreeContext from "../../Providers/ExecutionTreeContext";

import "./Timeline.scss";

/**
 * Renders the Timeline.
 * @return {JSX.Element}
 */
export function Timeline ({}) {
    const timelineRef = useRef();
    const needleRef = useRef();
    const handleRef = useRef();

    const {functionalSequence} = useContext(ExecutionTreeContext);

    const [unit, setUnit] = useState();
    const [duration, setDuration] = useState();
    const [events, setEvents] = useState();

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

        // needleRef.current.style.left = width/2 + "px";
        // handleRef.current.style.left = width/2 + "px";
    }, []);

    useEffect(() => {
        if (functionalSequence) {
            console.log(functionalSequence);

            drawSelector(functionalSequence);

            // setNeedle(time);
        }
    }, [functionalSequence]);


    /**
     * Draws the selector onto the screen.
     * @param {Object} entry
     */
    const drawSelector = (functionalSequence) => {
        const divs = [];
        for (let i = 0; i < functionalSequence.length; i++) {
            const entry = functionalSequence[i];
            if (entry.type == "selector") {
                const time = entry.timestamp.unix_millisecs;
                const xPos = getXPos(time);
                divs.push(
                    <div style={{left: xPos+"px"}} className="needle"></div>
                );
            }
        }
        setEvents(divs);
    };


    const setNeedle = (time) => {
        const startTimeDate = new Date(startTime.current);
        const currTimeDate = new Date(time);

        const delta = (currTimeDate.getTime() - startTimeDate.getTime()) / 1000;

        const xPos = delta * PIXELS_PER_UNIT;
        handleRef.current.style.left = xPos + "px";
        needleRef.current.style.left = xPos + "px";
    };

    /**
     * Get the x position of the time.
     * @param {Number} time
     * @return {Number}
     */
    const getXPos = (time) => {
        const startTimeDate = new Date(startTime.current);
        const currTimeDate = new Date(time);
        const delta = (currTimeDate.getTime() - startTimeDate.getTime()) / 1000;
        return delta * PIXELS_PER_UNIT;
    };

    return (
        <div className="outer-container">
            <div className="timeline-container" ref={timelineRef}>
                <div className="timeslot">
                    <div ref={handleRef} className="needle-handle"></div>
                </div>

                <div className="track">
                    {/* <div ref={needleRef} className="needle"></div> */}
                    {events}
                </div>

            </div>
        </div>
    );
}
