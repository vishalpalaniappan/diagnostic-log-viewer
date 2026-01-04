import React, {useContext, useEffect, useState} from "react";

import {Eye} from "react-bootstrap-icons";

import SegContext from "../../../Providers/SegContext";

import "./TimelineLabelsContainer.scss";

/**
 * Contains the timeline labels container.
 * @return {JSX.Element}
 */
export function TimelineLabelsContainer () {
    const {seg} = useContext(SegContext);
    const [threads, setThreads] = useState();

    useEffect(() => {
        console.log(seg);
        if (seg) {
            const threadsList = Object.keys(seg);
            setThreads(threadsList);
        }
    }, [seg]);


    const getThreads = () => {
        if (!threads) {
            return;
        }

        const threadDivs = [];
        for (let i = 0; i < threads.length; i++) {
            threadDivs.push(
                <div className="label-row">
                    <div className="icon-row"></div>
                    <span>{threads[i]}</span>
                </div>
            );
        }
        return threadDivs;
    };

    return (
        <div className="timelineLabelsContainer">
            <div className="label-row label-row-title">
                <div className="icon-row"><Eye /></div>
                <span>Threads</span>
            </div>
            {getThreads()}
        </div>
    );
}

export default TimelineLabelsContainer;
