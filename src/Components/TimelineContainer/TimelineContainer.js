import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import TimelineContainerContext from "./TimelineContainerContext";

import "./TimelineContainer.scss";

/**
 * Contains the timeline container.
 * @return {JSX.Element}
 */
export function TimelineContainer () {
    const accordian = useRef();
    const handle = useRef();
    const downValueX = useRef();

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

    return (
        <TimelineContainerContext.Provider value={{}}>
            <div className="treeMenuContainer d-flex flex-row">
                <div style={{width: ACCORDIAN_WIDTH+"px"}}
                    ref={accordian} className="accordian"></div>
                <div className="handle" ref={handle} onMouseDown={handleMouseDown} />
                <div className="flex-grow-1"></div>
            </div>
        </TimelineContainerContext.Provider>
    );
}

export default TimelineContainer;
