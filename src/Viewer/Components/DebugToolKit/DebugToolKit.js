import React, {useContext, useRef} from "react";

import {ArrowDownShort, ArrowLeftShort, ArrowRepeat,
    ArrowRightShort, ArrowUpShort, Play, Stop, ThreeDotsVertical} from "react-bootstrap-icons";

import WorkerContext from "../../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../../Services/CDL_WORKER_PROTOCOL";

import "./DebugToolKit.scss";


/**
 * This component creates a debug tool kit that can be
 * moved using a handle. This component is rendered above
 * all other components.
 * @return {JSX.Element}
 */
export function DebugToolKit ({}) {
    const container = useRef();

    const blueColor = "#75beff";
    const greenColor = "#88d084";
    const redColor = "#f48771";
    const greyColor = "#7c7c7c";

    const handleMouseDown = (e) => {
        console.log(e);
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.current.style.top = e.clientY + "px";
        container.current.style.left = e.clientX + "px";
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const {clpWorker} = useContext(WorkerContext);

    const stepInto = (e) => {
        if (clpWorker && clpWorker.current) {
            clpWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_INTO,
            });
        }
    };

    const stepOut = (e) => {
        if (clpWorker && clpWorker.current) {
            clpWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_OUT,
            });
        }
    };

    const stepOverForward = (e) => {
        if (clpWorker && clpWorker.current) {
            clpWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_OVER_FORWARD,
            });
        }
    };

    const stepOverBackward = (e) => {
        if (clpWorker && clpWorker.current) {
            clpWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.STEP_OVER_BACKWARD,
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
                <Play
                    className="me-1 icon"
                    style={{color: blueColor}}
                    size={22} />
                <ArrowLeftShort
                    className="me-1 icon"
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
                <ArrowRepeat
                    className="me-1 icon"
                    style={{color: greenColor}}
                    size={20} />
                <Stop className="me-1 icon"
                    style={{color: redColor}}
                    size={22} />
            </div>
        </div>
    );
}
