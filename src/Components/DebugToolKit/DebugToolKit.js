import React, {useContext, useRef} from "react";

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
        container.current.style.left = e.clientX - deltaX + "px";
        container.current.style.top = e.clientY - deltaY + "px";
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const {cdlWorker} = useContext(WorkerContext);

    const stepInto = (e) => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_INTO,
                args: {
                    position: stack[stackPosition].position,
                },
            });
        }
    };

    const stepOut = (e) => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_OUT,
                args: {
                    position: stack[stackPosition].position,
                },
            });
        }
    };

    const stepOverForward = (e) => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_OVER_FORWARD,
                args: {
                    position: stack[stackPosition].position,
                },
            });
        }
    };

    const stepOverBackward = (e) => {
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
