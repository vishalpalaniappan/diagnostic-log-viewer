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
            <div className="treeMenuContainer">
            </div>
        </TimelineContainerContext.Provider>
    );
}

export default BehavioralExecutionTree;
