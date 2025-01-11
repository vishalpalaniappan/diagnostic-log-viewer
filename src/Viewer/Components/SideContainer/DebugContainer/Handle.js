import React, {useRef} from "react";

import PropTypes from "prop-types";

import "./Handle.scss";

Handle.propTypes = {
    topDiv: PropTypes.object,
    bottomDiv: PropTypes.object,
};

/**
 * Renders a vertically resizable handle for the
 * accordian components.
 * @return {JSX.Element}
 */
export function Handle ({topDiv, bottomDiv}) {
    const handleRef = useRef();

    const MIN_CONTAINER_HEIGHT = 25;

    let downValueY;
    let preHeight;
    let postHeight;

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        downValueY = e.clientY;
        preHeight = topDiv.current.getBoundingClientRect().height;
        postHeight = bottomDiv.current.getBoundingClientRect().height;

        handleRef.current.classList.add("handle-active");
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.clientY - downValueY;
        const newPreHeight = preHeight + delta;
        const newPostHeight = postHeight - delta;

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
