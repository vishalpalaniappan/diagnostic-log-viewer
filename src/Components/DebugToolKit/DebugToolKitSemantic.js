import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import {ArrowDownShort, ArrowLeftShort, ArrowRepeat, ArrowRightShort, ArrowUpShort,
    Layers, Play, ThreeDotsVertical} from "react-bootstrap-icons";

import ActionsContext from "../../Providers/ActionsContext";
import BreakpointsContext from "../../Providers/BreakpointsContext";
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
    const {activeAbstraction, setActiveAbstraction,
        stacks, activeThread} = useContext(StackContext);
    const {setActions} = useContext(ActionsContext);
    const {cdlWorker} = useContext(WorkerContext);
    const {breakPoints} = useContext(BreakpointsContext);
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
    }, [stack, activeThread, stackPosition, stacks, semanticState]);

    const keydown = useCallback((e) => {
        switch (e.code) {
            case "KeyT":
                setActions((prev) => ({
                    value: "ToggleFocus",
                    tick: prev.tick + 1,
                }));
                toggleFocusOfDebugOperations();
                break;

            case "KeyB":
                setActions((prev) => ({
                    value: "Toggle Breakpoint",
                    tick: prev.tick + 1,
                }));
                toggleBreakpoint();
                break;

            case "KeyD":
                setActions((prev) => ({
                    value: "Disable Breakpoint",
                    tick: prev.tick + 1,
                }));
                disableBreakpoint();
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
                clearBreakpoints();
                break;

            case "ArrowRight":
                if (e.ctrlKey) {
                    setActions((prev) => ({
                        value: "Play Forward",
                        tick: prev.tick + 1,
                    }));
                    playForward();
                } else {
                    setActions((prev) => ({
                        value: "Step Over Forwards",
                        tick: prev.tick + 1,
                    }));
                    stepOverForward();
                }
                break;

            case "ArrowLeft":
                if (e.ctrlKey) {
                    setActions((prev) => ({
                        value: "Play Backward",
                        tick: prev.tick + 1,
                    }));
                    playBackward();
                } else {
                    setActions((prev) => ({
                        value: "Step Over Backwards",
                        tick: prev.tick + 1,
                    }));
                    stepOverBackward();
                }
                break;

            case "ArrowUp":
                if (e.ctrlKey) {
                    // Free shortcut, not used.
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
                    // Free shortcut, not used.
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
    }, [stack, activeThread, stackPosition, stacks, semanticState]);

    const sendToWorker = (code, args) => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({code: code, args: args});
        }
    };

    const toggleFocusOfDebugOperations = () => {
        let newBehavior;
        if (semanticState === "behavior") {
            newBehavior = "execution";
        } else if (semanticState === "execution") {
            newBehavior = "behavior";
        } else {
            // Default behavior
            newBehavior = "behavior";
        }
        setSemanticState(newBehavior);
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

    /**
     * Returns the position of the active abstraction in the execution tree.
     * @return {Number|null}
     */
    const getExecutionPosFromActiveAbstraction = () => {
        for (let i = 0; i < executionTree.length; i++) {
            const entry = executionTree[i];
            if (entry.index === activeAbstraction.node.index) {
                return i;
            }
        }
    };

    const stepInto = () => {
        // No valid behavior available, so we return
        if (behavior === undefined || !behavior || behavior.length === 0) {
            return;
        }

        if (semanticState === "behavior" && activeBehavior < behavior.length - 1) {
            setActiveBehavior(activeBehavior + 1);
            return;
        }

        if (semanticState === "execution") {
            const index = getExecutionPosFromActiveAbstraction();
            if (index + 1 < executionTree.length) {
                const node = executionTree[index + 1];
                setActiveAbstraction({
                    index: index + 1,
                    node: node,
                });
            }
            return;
        }
    };

    const stepOut = () => {
        // No valid behavior available, so we return
        if (behavior === undefined || !behavior || behavior.length === 0) {
            return;
        }

        if (semanticState === "behavior" && activeBehavior > 0) {
            let pos = activeBehavior;
            if (pos <= 0) {
                return;
            }

            const startLevel = behavior[pos].level;
            while (--pos >= 0) {
                const entry = behavior[pos];
                if (entry.level < startLevel) {
                    setActiveBehavior(pos);
                    break;
                }
            } ;
            return;
        }

        if (semanticState === "execution") {
            let pos = getExecutionPosFromActiveAbstraction();
            if (pos <= 0) {
                return;
            }

            const startLevel = executionTree[pos].level;
            while (--pos >= 0) {
                const entry = executionTree[pos];
                if (entry.level < startLevel) {
                    setActiveAbstraction({
                        index: pos,
                        node: executionTree[pos],
                    });
                    break;
                }
            };
            return;
        }
    };

    const stepOverForward = () => {
        // No valid behavior available, so we return
        if (behavior === undefined || !behavior || behavior.length === 0) {
            return;
        }

        if (semanticState === "behavior") {
            let pos = activeBehavior;
            if (pos >= behavior.length - 1) {
                return;
            }

            const startLevel = behavior[pos].level;
            while (++pos < behavior.length) {
                const entry = behavior[pos];
                if (entry.level <= startLevel) {
                    setActiveBehavior(pos);
                    break;
                }
            }
            return;
        };

        if (semanticState === "execution") {
            let pos = getExecutionPosFromActiveAbstraction();
            if (pos >= executionTree.length - 1) {
                return;
            }

            const startLevel = executionTree[pos].level;
            while (++pos <= executionTree.length - 1) {
                const entry = executionTree[pos];
                if (entry.level <= startLevel) {
                    setActiveAbstraction({
                        index: pos,
                        node: executionTree[pos],
                    });
                    break;
                }
            };
            return;
        }
    };

    const stepOverBackward = () => {
        // No valid behavior available, so we return
        if (behavior === undefined || !behavior || behavior.length === 0) {
            return;
        }

        if (semanticState === "behavior") {
            let pos = activeBehavior;
            if (pos <= 0) {
                return;
            }

            const startLevel = behavior[pos].level;
            while (--pos >= 0) {
                const entry = behavior[pos];
                if (entry.level <= startLevel) {
                    setActiveBehavior(pos);
                    break;
                }
            } ;
            return;
        };

        if (semanticState === "execution") {
            let pos = getExecutionPosFromActiveAbstraction();
            if (pos <= 0) {
                return;
            }

            const startLevel = executionTree[pos].level;
            while (--pos >= 0) {
                const entry = executionTree[pos];
                if (entry.level <= startLevel) {
                    setActiveAbstraction({
                        index: pos,
                        node: executionTree[pos],
                    });
                    break;
                }
            };
            return;
        }
    };

    const playForward = () => {
        // No valid behavior available, so we return
        if (behavior === undefined || !behavior || behavior.length === 0) {
            return;
        }

        // Move forward through the abstractions and execution until you
        // find a breakpoint. Its pretty inefficient because I don't start
        // from the currnt position, instead I search from the start. I
        // will optimize all that later.
        for (let i = 0; i < behavior.length; i++) {
            for (let j = 0; j < behavior[i].execution.length; j++) {
                const foundBreak = isBreakPoint(behavior[i].execution[j]);
                if (!foundBreak) {
                    continue;
                }

                if ((i === activeBehavior && j > activeAbstraction.index) || (i > activeBehavior)) {
                    const node = behavior[i].execution[j];
                    setActiveAbstraction({
                        index: j,
                        node: node,
                    });
                    setActiveBehavior(i);
                    return;
                }
            }
        }

        // Go to last execution if no breakpoints were found
        const execution = behavior[behavior.length - 1].execution;
        const lastExecution = execution[execution.length - 1];
        setActiveAbstraction({
            index: lastExecution.index,
            node: lastExecution,
        });
        setActiveBehavior(behavior.length - 1);
    };

    // Checks if the given execution position is a breakpoint.
    const isBreakPoint = (exec) => {
        if (!breakPoints || !exec) {
            return false;
        }
        for (let k = 0; k < breakPoints.length; k++) {
            const fileName = breakPoints[k].fileName;
            const lineNumber = breakPoints[k].lineno;
            if (exec.fileName === fileName && exec.lineno === lineNumber) {
                return true;
            }
        }
        return false;
    };

    const playBackward = () => {
        // No valid behavior available, so we return
        if (behavior === undefined || !behavior || behavior.length === 0) {
            return;
        }

        // Move back through the abstractions and execution until you
        // find a breakpoint
        for (let i = behavior.length - 1; i >= 0; i--) {
            for (let j = behavior[i].execution.length - 1; j >= 0; j--) {
                const foundBreak = isBreakPoint(behavior[i].execution[j]);
                if (!foundBreak) {
                    continue;
                }

                if ((i === activeBehavior && j < activeAbstraction.index - 1)
                    || (i < activeBehavior)) {
                    const node = behavior[i].execution[j];
                    setActiveAbstraction({
                        index: j,
                        node: node,
                    });
                    setActiveBehavior(i);
                    return;
                }
            }
        }

        // Go to first execution if no breakpoints were found
        const execution = behavior[0].execution;
        const firstExecution = execution[0];
        setActiveAbstraction({
            index: 0,
            node: firstExecution,
        });
        setActiveBehavior(0);
    };

    const replayProgram = () => {
        // No valid behavior available, so we return
        if (behavior === undefined || !behavior || behavior.length === 0) {
            return;
        }

        // Replay program from the start.
        for (let i = 0; i < behavior.length; i++) {
            for (let j = 0; j < behavior[i].execution.length; j++) {
                const foundBreak = isBreakPoint(behavior[i].execution[j]);
                if (!foundBreak) {
                    continue;
                }
                setActiveAbstraction({
                    index: j,
                    node: behavior[i].execution[j],
                });
                setActiveBehavior(i);
                return;
            }
        }

        // Go to last execution if no breakpoints were found
        const execution = behavior[behavior.length - 1].execution;
        const lastExecution = execution[execution.length - 1];
        setActiveAbstraction({
            index: lastExecution.index,
            node: lastExecution,
        });
        setActiveBehavior(behavior.length - 1);
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
                <Layers
                    className="ms-1 icon align-self-center"
                    title="Toggle Focus between Behavior and Execution (T)"
                    onClick={toggleFocusOfDebugOperations}
                    style={{color: blueColor}}
                    size={20} />
            </div>
        </div>
    );
}
