import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import {ArrowDownShort, ArrowLeftShort, ArrowRepeat, ArrowRightShort, ArrowUpShort,
    Play, ThreeDotsVertical} from "react-bootstrap-icons";

import ActionsContext from "../../Providers/ActionsContext";
import ExecutionTreeContext from "../../Providers/ExecutionTreeContext";
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
export function DebugToolKitSemantic ({}) {
    const container = useRef();

    const {stackPosition, setStackPosition} = useContext(StackPositionContext);
    const {stacks, activeThread} = useContext(StackContext);
    const {setActions} = useContext(ActionsContext);
    const {cdlWorker} = useContext(WorkerContext);
    const {behavior, activeBehavior, semanticState, setActiveBehavior,
        setSemanticState, executionTree} = useContext(ExecutionTreeContext);

    const [stack, setStack] = useState();

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
        container.current.style.left = document.body.clientWidth - 900 + "px";
    }, []);

    useEffect(() => {
        if (stacks && activeThread) {
            setStack(stacks[activeThread].stack);
        }
    }, [stacks, activeThread]);

    useEffect(() => {
        document.addEventListener("keydown", keydown, false);
        return () => {
            document.removeEventListener("keydown", keydown, false);
        };
    }, [stack, activeThread, stackPosition, stacks]);

    const keydown = useCallback((e) => {
        switch (e.code) {
            case "KeyT":
                setActions((prev) => ({
                    value: "ToggleFocus",
                    tick: prev.tick + 1,
                }));
                toggleFocus();
                break;

            case "KeyB":
                setActions((prev) => ({
                    value: "Toggle Breakpoint",
                    tick: prev.tick + 1,
                }));
                // toggleBreakpoint();
                break;

            case "KeyD":
                setActions((prev) => ({
                    value: "Disable Breakpoint",
                    tick: prev.tick + 1,
                }));
                // disableBreakpoint();
                break;

            case "KeyR":
                setActions((prev) => ({
                    value: "Replay Program from Start",
                    tick: prev.tick + 1,
                }));
                // replayProgram();
                break;

            case "KeyC":
                setActions((prev) => ({
                    value: "Clear Breakpoints",
                    tick: prev.tick + 1,
                }));
                // clearBreakpoints();
                break;

            case "ArrowRight":
                if (e.ctrlKey) {
                    setActions((prev) => ({
                        value: "Play Forward",
                        tick: prev.tick + 1,
                    }));
                    // playForward();
                } else {
                    setActions((prev) => ({
                        value: "Step Over Forwards",
                        tick: prev.tick + 1,
                    }));
                    // stepOverForward();
                }
                break;

            case "ArrowLeft":
                if (e.ctrlKey) {
                    setActions((prev) => ({
                        value: "Play Backward",
                        tick: prev.tick + 1,
                    }));
                    // playBackward();
                } else {
                    setActions((prev) => ({
                        value: "Step Over Backwards",
                        tick: prev.tick + 1,
                    }));
                    // stepOverBackward();
                }
                break;

            case "ArrowUp":
                if (e.ctrlKey) {
                    if (!executionTree) {
                        // moveUpStack();
                    }
                } else {
                    setActions((prev) => ({
                        value: "Step Out of Current Level",
                        tick: prev.tick + 1,
                    }));
                    stepOut();
                }
                break;

            case "ArrowDown":
                if (e.ctrlKey) {
                    if (!executionTree) {
                        // moveDownStack();
                    }
                } else {
                    setActions((prev) => ({
                        value: "Step Into Next Level",
                        tick: prev.tick + 1,
                    }));
                    stepInto();
                }
                break;

            default:
                break;
        }
    }, [stack, activeThread, stackPosition, stacks]);

    const sendToWorker = (code, args) => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({code: code, args: args});
        }
    };

    const toggleFocus = () => {
        setSemanticState((prev) => ({
            focus: (prev.focus=="behavior")?"execution":"behavior",
            behavioralPos: prev.behavioralPos,
            executionPos: prev.executionPos,
            tick: prev.tick + 1,
        }));
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

    const clearBreakpoints = () => {
        const code = CDL_WORKER_PROTOCOL.CLEAR_BREAKPOINTS;
        const args = {};
        sendToWorker(code, args);
    };

    const stepInto = () => {
        if (activeBehavior < behavior.length - 1) {
            setActiveBehavior(activeBehavior + 1);
        }
    };

    const stepOut = () => {
        if (activeBehavior > 0) {
            setActiveBehavior(activeBehavior - 1);
        }
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
        if (stackPosition + 1 < stack.callStack.length) {
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
                    title="Play Forward (Ctrl + →)"
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
