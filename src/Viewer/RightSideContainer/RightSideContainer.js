import React, {useRef, useState} from "react";

import {TraceDiagram} from "../../Components/TraceDiagram/TraceDiagram";

import "./RightSideContainer.scss";

/**
 * Renders the right side menu and accordian containers.
 * @return {JSX.Element}
 */
export function RightSideContainer () {
    const accordian = useRef();
    const handle = useRef();

    const ACCORDIAN_WIDTH = 700;
    const MIN_EDITOR_WIDTH = 400;
    const MIN_ACCORDIAN_WIDTH = 200;
    const MAX_ACCORDIAN_WIDTH = document.body.clientWidth - MIN_EDITOR_WIDTH;

    let downValueX;
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        handle.current.classList.add("handle-active");
        downValueX = e.clientX;
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.clientX - downValueX;
        const newWidth = accordian.current.getBoundingClientRect().width - delta;
        if (newWidth > MIN_ACCORDIAN_WIDTH && newWidth < MAX_ACCORDIAN_WIDTH) {
            accordian.current.style.width = newWidth + "px";
            downValueX = e.clientX;
        }
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        handle.current.classList.remove("handle-active");
    };

    return (
        <div className="side-container d-flex flex-row">
            <div className="handle" ref={handle} onMouseDown={handleMouseDown}></div>
            <div className="accordian" ref={accordian} style={{width: ACCORDIAN_WIDTH+"px"}}>
                <TraceDiagram />
            </div>
        </div>
    );
}
