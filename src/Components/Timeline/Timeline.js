import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";

import "./Timeline.scss";

/**
 * Renders the Timeline.
 * @return {JSX.Element}
 */
export function Timeline ({}) {
    const timelineRef = useRef();
    const needleRef = useRef();

    useLayoutEffect(() => {

    }, []);
    return (
        <div className="outer-container">
            <div className="timeline-container" ref={timelineRef}>
                <div className="timeslot">

                </div>

                <div className="track">
                    <div ref={needleRef} className="needle"></div>

                </div>

            </div>
        </div>
    );
}
