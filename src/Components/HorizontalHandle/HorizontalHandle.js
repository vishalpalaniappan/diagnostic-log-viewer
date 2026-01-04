import React, {useCallback, useEffect, useRef} from "react";

import PropTypes from "prop-types";

import "./HorizontalHandle.scss";

HorizontalHandle.propTypes = {
    leftDiv: PropTypes.object,
    rightDiv: PropTypes.object,
};

/**
 * Renders a horizontally resizable handle for the accordian components.
 * It accepts two components which are resized when the handle is moved.
 * @return {JSX.Element}
 */
export function HorizontalHandle ({leftDiv, rightDiv}) {
    const handleRef = useRef();
    const downValueX = useRef();
    const leftWidth = useRef();
    const rightWidth = useRef();

    const MIN_CONTAINER_WIDTH = 25;

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        downValueX.current = e.clientX;
        leftWidth.current = leftDiv.current.getBoundingClientRect().width;
        rightWidth.current = rightDiv.current.getBoundingClientRect().width;

        handleRef.current.classList.add("handle-active");
    }, [handleMouseMove, handleMouseUp]);

    const handleMouseMove = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.clientX - downValueX.current;
        const newPreWidth = leftWidth.current + delta;
        const newPostWidth = rightWidth.current - delta;

        if (newPreWidth > MIN_CONTAINER_WIDTH && newPostWidth > MIN_CONTAINER_WIDTH) {
            leftDiv.current.style.width = newPreWidth + "px";
            rightDiv.current.style.width = newPostWidth + "px";
        }
    }, [leftDiv, rightDiv]);

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
        <div ref={handleRef} onMouseDown={handleMouseDown} className="horizontal-handle"></div>
    );
}
