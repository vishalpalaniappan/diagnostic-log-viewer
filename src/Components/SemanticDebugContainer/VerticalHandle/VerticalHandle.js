import React, {useCallback, useEffect, useRef} from "react";

import PropTypes from "prop-types";

import "./VerticalHandle.scss";

VerticalHandle.propTypes = {
    topDiv: PropTypes.object,
    bottomDiv: PropTypes.object,
};

/**
 * Renders a vertically resizable handle for the accordian components.
 * It accepts two components which are resized when the handle is moved.
 * @return {JSX.Element}
 */
export function VerticalHandle ({topDiv, bottomDiv}) {
    const handleRef = useRef();
    const downValueY = useRef();
    const topHeight = useRef();
    const bottomHeight = useRef();

    const MIN_CONTAINER_HEIGHT = 50;
    const MAX_CONTAINER_HEIGHT = 250;

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        downValueY.current = e.clientY;
        topHeight.current = topDiv.current.getBoundingClientRect().height;
        bottomHeight.current = bottomDiv.current.getBoundingClientRect().height;

        handleRef.current.classList.add("handle-active");
    }, [handleMouseMove, handleMouseUp]);

    const handleMouseMove = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.clientY - downValueY.current;
        const newPreHeight = topHeight.current + delta;
        const newPostHeight = bottomHeight.current - delta;

        if (newPostHeight < MAX_CONTAINER_HEIGHT &&
            newPreHeight > MIN_CONTAINER_HEIGHT &&
            newPostHeight > MIN_CONTAINER_HEIGHT) {
            topDiv.current.style.height = newPreHeight + "px";
            bottomDiv.current.style.height = newPostHeight + "px";
        }
    }, [topDiv, bottomDiv]);

    const handleMouseUp = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        handleRef.current.classList.remove("handle-active");
    }, [handleMouseMove]);

    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <div ref={handleRef} onMouseDown={handleMouseDown} className="vertical-handle"></div>
    );
}