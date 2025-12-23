import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";

import CDL_WORKER_PROTOCOL from "../Services/CDL_WORKER_PROTOCOL";
import ActionsContext from "./ActionsContext";
import ActiveFileContext from "./ActiveFileContext";
import BreakpointsContext from "./BreakpointsContext";
import ExecutionTreeContext from "./ExecutionTreeContext";
import FileTreeContext from "./FileTreeContext";
import GlobalVariablesContext from "./GlobalVariablesContext";
import StackContext from "./StackContext";
import StackPositionContext from "./StackPositionContext";
import ThreadsContext from "./ThreadsContext";
import VariablesContext from "./VariablesContext";
import WorkerContext from "./WorkerContext";

CDLProviders.propTypes = {
    children: PropTypes.object,
    fileInfo: PropTypes.string,
    executionIndex: PropTypes.number,
};

/**
 * Provides all contexts consumed by the application.
 * @param {JSX} children
 * @param {String} fileInfo
 * @param {Number} executionIndex
 * @return {JSX}
 */
function CDLProviders ({children, fileInfo, executionIndex}) {
    const [isLoading, setIsLoading] = useState(false);
    const [activeFile, setActiveFile] = useState();
    const [stacks, setStacks] = useState();
    const [activeThread, setActiveThread] = useState();
    const [stackPosition, setStackPosition] = useState();
    const [localVariables, setLocalVariables] = useState();
    const [globalVariables, setGlobalVariables] = useState();
    const [fileTree, setFileTree] = useState();
    const [breakPoints, setBreakPoints] = useState();
    const [threads, setThreads] = useState();
    const [activeAbstraction, setActiveAbstraction] = useState();
    const [executionTree, setExecutionTree] = useState();
    const [behavior, setBehavior] = useState();
    const [activeBehavior, setActiveBehavior] = useState();
    const [actions, setActions] = useState({value: "", tick: 0});

    const cdlWorker = useRef(null);

    // Terminate worker when component is destroyed.
    useEffect(() => {
        return () => {
            if (cdlWorker.current) {
                cdlWorker.current.terminate();
            }
        };
    }, []);

    // Get new variable stack if stack position changes and update active file
    useEffect(() => {
        if (cdlWorker?.current && stackPosition !== undefined &&
             activeThread && stacks?.[activeThread]?.stack) {
            const stack = stacks[activeThread].stack;

            if (stackPosition >= stack.callStack.length) {
                console.warn("Stack position out of bounds");
                return;
            }

            setActiveFile(stack.callStack[stackPosition].filePath);
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
                args: {
                    position: stack.callStack[stackPosition].position,
                    threadId: stack.callStack[stackPosition].threadId,
                },
            });
        } else {
            console.warn("Invalid stack position or stack not initialized");
        };
    }, [stackPosition, stacks, activeThread]);


    useEffect(() => {
        if (activeAbstraction && cdlWorker.current) {
            const code = CDL_WORKER_PROTOCOL.GO_TO_POSITION;
            const args = {
                position: activeAbstraction.node.position,
                threadId: activeAbstraction.node.threadId,
            };
            cdlWorker.current.postMessage({code: code, args: args});
        }
    }, [activeAbstraction]);

    // Resets the state variables before loading new file.
    const initializeStates = () => {
        setFileTree(undefined);
        setLocalVariables(undefined);
        setGlobalVariables(undefined);
        setStackPosition(undefined);
        setActiveThread(undefined);
        setActiveFile(undefined);
        setBreakPoints(undefined);
        setExecutionTree(undefined);
    };

    // Create worker to handle file.
    useEffect(() => {
        if (fileInfo) {
            // TODO: Use loading state to show loading animation.
            setIsLoading(true);
            initializeStates();
            try {
                if (cdlWorker.current) {
                    cdlWorker.current.terminate();
                }
                cdlWorker.current = new Worker(
                    new URL("../Services/cdlWorker.js", import.meta.url)
                );
                cdlWorker.current.onmessage = handleWorkerMessage;
                cdlWorker.current.postMessage({
                    code: CDL_WORKER_PROTOCOL.LOAD_FILE,
                    args: {
                        fileInfo: fileInfo,
                        executionIndex: executionIndex,
                    },
                });
            } catch (error) {
                console.error("Failed to initialize worker:", error);
            }
        }
    }, [fileInfo]);


    /**
     * Set the threadID of the active stack.
     * @param {Array} _stacks
     */
    const setActiveStack = (_stacks) => {
        Object.keys(_stacks).forEach((threadId, value) => {
            if (_stacks[threadId].main) {
                setActiveThread(threadId);
                return;
            }
        });
    };

    /**
     * Handles message from the worker.
     * @param {object} event
     */
    const handleWorkerMessage = useCallback((event) => {
        switch (event.data.code) {
            case CDL_WORKER_PROTOCOL.GET_METADATA:
                setIsLoading(false);
                setFileTree(event.data.args.fileTree);
                break;
            case CDL_WORKER_PROTOCOL.GET_POSITION_DATA:
                setStackPosition(0);
                setStacks(event.data.args);
                setActiveStack(event.data.args);
                break;
            case CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK:
                setLocalVariables(event.data.args.localVariables);
                setGlobalVariables(event.data.args.globalVariables);
                break;
            case CDL_WORKER_PROTOCOL.BREAKPOINTS:
                setBreakPoints(event.data.args.breakpoints);
                break;
            case CDL_WORKER_PROTOCOL.GET_EXECUTION_TREE:
                setExecutionTree(event.data.args.executionTree);
                setBehavior(event.data.args.behavior);
                break;
            default:
                break;
        }
    });

    return (
        <StackPositionContext.Provider value={{stackPosition, setStackPosition}}>
            <FileTreeContext.Provider value={{fileTree}}>
                <WorkerContext.Provider value={{cdlWorker}}>
                    <ThreadsContext.Provider value={{threads, setThreads}}>
                        <GlobalVariablesContext.Provider value={{globalVariables}}>
                            <VariablesContext.Provider value={{localVariables}}>
                                <BreakpointsContext.Provider value={{breakPoints}}>
                                    <StackContext.Provider
                                        value={{stacks, activeThread, activeAbstraction,
                                            setActiveThread, setActiveAbstraction}}>
                                        <ActiveFileContext.Provider
                                            value={{activeFile, setActiveFile}}>
                                            <ExecutionTreeContext.Provider
                                                value={{executionTree, setExecutionTree, behavior,
                                                    activeBehavior, setActiveBehavior,
                                                }}>
                                                <ActionsContext.Provider
                                                    value={{actions, setActions}}>
                                                    {children}
                                                </ActionsContext.Provider>
                                            </ExecutionTreeContext.Provider>
                                        </ActiveFileContext.Provider>
                                    </StackContext.Provider>
                                </BreakpointsContext.Provider>
                            </VariablesContext.Provider>
                        </GlobalVariablesContext.Provider>
                    </ThreadsContext.Provider>
                </WorkerContext.Provider>
            </FileTreeContext.Provider>
        </StackPositionContext.Provider>
    );
};

export default CDLProviders;
