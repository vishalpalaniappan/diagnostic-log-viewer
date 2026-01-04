import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import SegContext from "../../Providers/SegContext";
import TimelineContainerContext from "./TimelineContainerContext";
import TimelineLabelsContainer from "./TimelineLabelsContainer/TimelineLabelsContainer";
import TimelineTracksContainer from "./TimelineTracksContainer/TimelineTracksContainer";

import "./TimelineContainer.scss";

/**
 * Contains the timeline container.
 * @return {JSX.Element}
 */
export function TimelineContainer () {
    const {seg} = useContext(SegContext);
    const accordian = useRef();
    const handle = useRef();
    const downValueX = useRef();
    const [durations, setDurations] = useState();

    const ACCORDIAN_WIDTH = 200;
    const MIN_EDITOR_WIDTH = 200;
    const MIN_ACCORDIAN_WIDTH = 50;

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        handle.current.classList.add("handle-active");
        downValueX.current = e.clientX;
    };

    const handleMouseMove = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.clientX - downValueX.current;
        const newWidth = accordian.current.getBoundingClientRect().width + delta;
        const MAX_ACCORDIAN_WIDTH = document.body.clientWidth - MIN_EDITOR_WIDTH;
        if (newWidth > MIN_ACCORDIAN_WIDTH && newWidth < MAX_ACCORDIAN_WIDTH) {
            accordian.current.style.width = newWidth + "px";
            downValueX.current = e.clientX;
        }
    }, []);

    const handleMouseUp = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            handle.current.classList.remove("handle-active");
        },
        [handleMouseMove]
    );

    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);


    useEffect(() => {
        if (seg) {
            const threads = Object.keys(seg);

            const threadDurations = {};
            let maxDuration = 0;

            // Calculate the duration of threads and save max duration
            for (let i = 0; i < threads.length; i++) {
                const thread = seg[threads[i]];
                const startTimeDate = new Date(thread[0].abstraction.timestamp.unix_millisecs);
                const endTimeDate = new Date(
                    thread[thread.length - 1].abstraction.timestamp.unix_millisecs
                );
                const seconds = (endTimeDate.getTime() - startTimeDate.getTime()) / 1000;
                threadDurations[thread] = {"duration": seconds};

                if (seconds > maxDuration) {
                    maxDuration = seconds;
                }
            }

            setDurations({
                "max": maxDuration,
                "threads": threadDurations,
            });
        }
    }, [seg]);

    return (
        <TimelineContainerContext.Provider value={{durations}}>
            <div className="timelineContainer d-flex flex-row">
                <div style={{width: ACCORDIAN_WIDTH+"px"}}
                    ref={accordian} className="accordian">
                    <TimelineLabelsContainer />
                </div>
                <div className="handle" ref={handle} onMouseDown={handleMouseDown} />
                <div className="flex-grow-1">
                    <TimelineTracksContainer />
                </div>
            </div>
        </TimelineContainerContext.Provider>
    );
}

export default TimelineContainer;
