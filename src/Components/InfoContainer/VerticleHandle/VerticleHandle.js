import React, {useRef} from "react";

import PropTypes from "prop-types";

import "./VerticleHandle.scss";

VerticleHandle.propTypes = {
    topDiv: PropTypes.object,
    bottomDiv: PropTypes.object,
};

/**
 * Renders a vertically resizable handle for the accordian components.
 * It accepts two components which are resized when the handle is moved.
 * @return {JSX.Element}
 */
export function VerticleHandle ({topDiv, bottomDiv}) {
    const handleRef = useRef();

    const MIN_CONTAINER_HEIGHT = 25;

    // Initial values used to calculate delta on mouse move.
    let downValueY;
    let topHeight;
    let bottomHeight;

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        downValueY = e.clientY;
        topHeight = topDiv.current.getBoundingClientRect().height;
        bottomHeight = bottomDiv.current.getBoundingClientRect().height;

        handleRef.current.classList.add("handle-active");
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.clientY - downValueY;
        const newPreHeight = topHeight + delta;
        const newPostHeight = bottomHeight - delta;

        if (newPreHeight > MIN_CONTAINER_HEIGHT && newPostHeight > MIN_CONTAINER_HEIGHT) {
            topDiv.current.style.height = newPreHeight + "px";
            bottomDiv.current.style.height = newPostHeight + "px";
        }
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        handleRef.current.classList.remove("handle-active");
    };

    return (
        <div ref={handleRef} onMouseDown={handleMouseDown} className="vertical-handle"></div>
    );
}
