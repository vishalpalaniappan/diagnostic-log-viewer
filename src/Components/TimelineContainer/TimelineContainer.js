import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import SegContext from "../../Providers/SegContext";
import TimelineContainerContext from "./TimelineContainerContext";
import TimelineLabelsContainer from "./TimelineLabelsContainer/TimelineLabelsContainer";
import TimelineTracksContainer from "./TimelineTracksContainer/TimelineTracksContainer";
import { HorizontalHandle } from "../HorizontalHandle/HorizontalHandle";

import "./TimelineContainer.scss";

/**
 * Contains the timeline container.
 * @return {JSX.Element}
 */
export function TimelineContainer () {
    const {seg} = useContext(SegContext);
    const labelsRef = useRef();
    const tracksRef = useRef();
    const timelineRef = useRef();
    const [durations, setDurations] = useState();


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
            <div ref={timelineRef} className="timelineContainer">
                <div ref={labelsRef} className="labelsContainer">
                    <TimelineLabelsContainer />
                </div>
                <HorizontalHandle leftDiv={labelsRef} rightDiv={tracksRef} />
                <div ref={tracksRef} className="tracksContainer">
                    <TimelineTracksContainer />
                </div>
            </div>
        </TimelineContainerContext.Provider>
    );
}

export default TimelineContainer;
