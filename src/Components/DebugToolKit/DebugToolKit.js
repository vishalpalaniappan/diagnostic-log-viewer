import React, {useContext, useEffect, useRef} from "react";

import {ArrowDownShort, ArrowLeftShort, ArrowRightShort,
    ArrowUpShort, ThreeDotsVertical} from "react-bootstrap-icons";

import StackContext from "../../Providers/StackContext";
import StackPositionContext from "../../Providers/StackPositionContext";
import WorkerContext from "../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../Services/CDL_WORKER_PROTOCOL";

import "./DebugToolKit.scss";


/**
 * This component creates a debug tool kit that can be
 * moved using a handle. This component is rendered above
 * all other components.
 * @return {JSX.Element}
 */
export function DebugToolKit ({}) {
    const container = useRef();

    const {stackPosition} = useContext(StackPositionContext);
    const {stack} = useContext(StackContext);
    const {cdlWorker} = useContext(WorkerContext);

    const blueColor = "#75beff";
    const greyColor = "#7c7c7c";

    let deltaX;
    let deltaY;

    const handleMouseDown = (e) => {
        const rect = container.current.getBoundingClientRect();
        deltaX = e.clientX - rect.x;
        deltaY = e.clientY - rect.y;
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = container.current.getBoundingClientRect();
        const newX = e.clientX - deltaX;
        const newY = e.clientY - deltaY;

        // Bound the container to stay within the screen width
        if (newX + rect.width < document.body.clientWidth && newX >= 0) {
            container.current.style.left = e.clientX - deltaX + "px";
        } else if (newX <= 0) {
            container.current.style.left = 0;
        } else {
            container.current.style.left = document.body.clientWidth - rect.width + "px";
        }

        // Bound the container to stay within the screen height
        if (newY + rect.height < document.body.clientHeight && newY >= 0) {
            container.current.style.top = e.clientY - deltaY + "px";
        } else if (newY <= 0) {
            container.current.style.top = 0;
        } else {
            container.current.style.top = document.body.clientHeight - rect.height + "px";
        }
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    // Set initial position of container
    useEffect(() => {
        container.current.style.top = "100px";
        container.current.style.left = document.body.clientWidth - 300 + "px";
    }, []);

    // Add keydown event listener
    useEffect(() => {
        document.addEventListener("keydown", keydown, false);
        return () => {
            document.removeEventListener("keydown", keydown, false);
        };
    }, [stack, stackPosition]);

    const keydown = (e) => {
        switch (e.code) {
            case "ArrowRight":
                stepOverForward();
                break;
            case "ArrowLeft":
                stepOverBackward();
                break;
            case "ArrowUp":
                stepOut();
                break;
            case "ArrowDown":
                stepInto();
                break;
            default:
                break;
        }
    };

    const stepInto = () => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_INTO,
                args: {
                    position: stack[stackPosition].position,
                },
            });
        }
    };

    const stepOut = () => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_OUT,
                args: {
                    position: stack[stackPosition].position,
                },
            });
        }
    };

    const stepOverForward = () => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_OVER_FORWARD,
                args: {
                    position: stack[stackPosition].position,
                },
            });
        }
    };

    const stepOverBackward = () => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_OVER_BACKWARD,
                args: {
                    position: stack[stackPosition].position,
                },
            });
        }
    };


    return (
        <div ref={container} className="toolkit-container">
            <div className="d-flex w-100 h-100">
                <ThreeDotsVertical
                    onMouseDown={handleMouseDown}
                    className="icon"
                    style={{color: greyColor, cursor: "move"}}
                    size={20} />
                <ArrowLeftShort
                    className="me-1 icon"
                    title="Step Backwards (CTRL + Left Arrow)"
                    onClick={stepOverBackward}
                    style={{color: blueColor}}
                    size={22} />
                <ArrowRightShort
                    className="me-1 icon"
                    onClick={stepOverForward}
                    style={{color: blueColor}}
                    size={22} />
                <ArrowUpShort
                    className="me-1 icon"
                    onClick={stepOut}
                    style={{color: blueColor}}
                    size={22} />
                <ArrowDownShort
                    className="me-1 icon"
                    onClick={stepInto}
                    style={{color: blueColor}}
                    size={22} />
            </div>
        </div>
    );
}
