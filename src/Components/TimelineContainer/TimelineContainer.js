import React, {useContext, useEffect, useState} from "react";

import TimelineContainerContext from "./TimelineContainerContext";

import "./TimelineContainer.scss";

/**
 * Contains the timeline container.
 * @return {JSX.Element}
 */
export function TimelineContainer () {
    return (
        <TimelineContainerContext.Provider value={{}}>
            <div className="w-100 h-100 d-flex flex-row">
                <div style={{width: "300px"}} className="">

                </div>
                <div style={{width: "1px", backgroundColor: "red"}} className="">

                </div>
                <div className="flex-grow-1">
                    
                </div>
            </div>
        </TimelineContainerContext.Provider>
    );
}

export default TimelineContainer;
