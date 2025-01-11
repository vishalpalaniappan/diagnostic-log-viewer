import React, {useRef} from "react";

import "./SideContainer.scss";

/**
 * Contains the side menu and accordian containers.
 * @return {JSX.Element}
 */
export function SideContainer () {
    const accordian = useRef();
    const handle = useRef();

    const SIDE_MENU_WIDTH = 50;
    const ACCORDIAN_WIDTH = 300;
    const MIN_ACCORDIAN_WIDTH = 200;
    const MAX_ACCORDIAN_WIDTH = document.body.clientWidth - SIDE_MENU_WIDTH - 400;

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
        const newWidth = accordian.current.getBoundingClientRect().width + delta;
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
            <div className="menu" style={{width: SIDE_MENU_WIDTH+"px"}}>

            </div>
            <div className="accordian" ref={accordian} style={{width: ACCORDIAN_WIDTH+"px"}}>

            </div>
            <div className="handle" ref={handle} onMouseDown={handleMouseDown}>

            </div>
        </div>
    );
}
