import React, {useContext, useEffect, useState} from "react";

import TimelineContainerContext from "../TimelineContainerContext";

import "./TimelineTracksContainer.scss";

/**
 * Contains the timeline tracks container..
 * @return {JSX.Element}
 */
export function TimelineTracksContainer () {
    const {durations} = useContext(TimelineContainerContext);

    useEffect(() => {
        if (durations) {
            console.log(durations.max + " seconds");
        }
    }, [durations]);

    return (
        <div className="timelineTracksContainer">
        </div>
    );
}

export default TimelineTracksContainer;
