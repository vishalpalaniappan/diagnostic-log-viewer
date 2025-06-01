import React, {useContext, useEffect, useRef} from "react";

import {ArrowDownShort, ArrowLeftShort, ArrowRepeat, ArrowRightShort, ArrowUpShort,
    Play, ThreeDotsVertical} from "react-bootstrap-icons";

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

    const {stackPosition, setStackPosition} = useContext(StackPositionContext);
    const {stack} = useContext(StackContext);
    const {cdlWorker} = useContext(WorkerContext);

    const blueColor = "#75beff";
    const greyColor = "#7c7c7c";
    const greenColor = "#00BB00";

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
            case "KeyB":
                toggleBreakpoint();
                break;
            case "KeyD":
                disableBreakpoint();
                break;
            case "KeyR":
                replayProgram();
                break;
            case "ArrowRight":
                (e.ctrlKey)?playForward():stepOverForward();
                break;
            case "ArrowLeft":
                (e.ctrlKey)?playBackward():stepOverBackward();
                break;
            case "ArrowUp":
                (e.ctrlKey)?moveUpStack():stepOut();
                break;
            case "ArrowDown":
                (e.ctrlKey)?moveDownStack():stepInto();
                break;
            default:
                break;
        }
    };

    const sendToWorker = (code, args) => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({code: code, args: args});
        }
    };

    const toggleBreakpoint = () => {
        const code = CDL_WORKER_PROTOCOL.TOGGLE_BREAKPOINT;
        const args = {
            fileName: stack.callStack[stackPosition].filePath,
            lineNumber: stack.callStack[stackPosition].lineno,
        };
        sendToWorker(code, args);
    };

    const disableBreakpoint = () => {
        const code = CDL_WORKER_PROTOCOL.TOGGLE_BREAKPOINT_ENABLED;
        const args = {
            fileName: stack.callStack[stackPosition].filePath,
            lineNumber: stack.callStack[stackPosition].lineno,
        };
        sendToWorker(code, args);
    };

    const stepInto = () => {
        const code = CDL_WORKER_PROTOCOL.STEP_INTO;
        const args = {
            position: stack.callStack[stackPosition].position,
            threadId: stack.callStack[stackPosition].threadId,
        };
        sendToWorker(code, args);
    };

    const stepOut = () => {
        const code = CDL_WORKER_PROTOCOL.STEP_OUT;
        const args = {
            position: stack.callStack[stackPosition].position,
            threadId: stack.callStack[stackPosition].threadId,
        };
        sendToWorker(code, args);
    };

    const stepOverForward = () => {
        const code = CDL_WORKER_PROTOCOL.STEP_OVER_FORWARD;
        const args = {
            position: stack.callStack[stackPosition].position,
            threadId: stack.callStack[stackPosition].threadId,
        };
        sendToWorker(code, args);
    };

    const stepOverBackward = () => {
        const code = CDL_WORKER_PROTOCOL.STEP_OVER_BACKWARD;
        const args = {
            position: stack.callStack[stackPosition].position,
            threadId: stack.callStack[stackPosition].threadId,
        };
        sendToWorker(code, args);
    };

    const playForward = () => {
        const code = CDL_WORKER_PROTOCOL.PLAY_FORWARD;
        const args = {
            position: stack.callStack[stackPosition].position,
            threadId: stack.callStack[stackPosition].threadId,
        };
        sendToWorker(code, args);
    };

    const playBackward = () => {
        const code = CDL_WORKER_PROTOCOL.PLAY_BACKWARD;
        const args = {
            position: stack.callStack[stackPosition].position,
            threadId: stack.callStack[stackPosition].threadId,
        };
        sendToWorker(code, args);
    };

    const replayProgram = () => {
        const code = CDL_WORKER_PROTOCOL.REPLAY;
        const args = {};
        sendToWorker(code, args);
    };

    const moveUpStack = () => {
        if (stackPosition + 1 < stack.length) {
            setStackPosition(stackPosition + 1);
        }
    };

    const moveDownStack = () => {
        if (stackPosition - 1 >= 0) {
            setStackPosition(stackPosition - 1);
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
                    title="Play (Right Bracket Key)"
                    onClick={playForward}
                    style={{color: blueColor}}
                    size={22} />
                <ArrowLeftShort
                    className="me-1 icon"
                    title="Step Over Backward (← Key)"
                    onClick={stepOverBackward}
                    style={{color: blueColor}}
                    size={22} />
                <ArrowRightShort
                    className="me-1 icon"
                    title="Step Over Forward (→ Key)"
                    onClick={stepOverForward}
                    style={{color: blueColor}}
                    size={22} />
                <ArrowUpShort
                    className="me-1 icon"
                    title="Step Out (↑ Key)"
                    onClick={stepOut}
                    style={{color: blueColor}}
                    size={22} />
                <ArrowDownShort
                    className="me-1 icon"
                    onClick={stepInto}
                    title="Step Into (↓ Key)"
                    style={{color: blueColor}}
                    size={22} />
                <ArrowRepeat
                    className="me-1 icon"
                    title="Restart (R Key)"
                    onClick={replayProgram}
                    style={{color: greenColor}}
                    size={22} />
            </div>
        </div>
    );
}
