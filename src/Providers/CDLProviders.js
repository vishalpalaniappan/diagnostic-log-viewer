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
    const [executionTreeFull, setExecutionTreeFull] = useState();
    const [behavior, setBehavior] = useState();
    const [rootCauses, setRootCauses] = useState();
    const [mode, setMode] = useState("STACK");
    const [activeBehavior, setActiveBehavior] = useState();
    const [actions, setActions] = useState({value: "", tick: 0});

    const [semanticState, setSemanticState] = useState("behavior");

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
        setActiveBehavior(undefined);
        setBehavior(undefined);
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

    const saveRootCauses = (executionTree) => {
        const lastEntry = executionTree[executionTree.length - 1];
        const rootCauses = [];
        if (lastEntry && "failureInfo" in lastEntry) {
            lastEntry["failureInfo"].forEach((failure, index) => {
                rootCauses.push(failure.cause);
            });
        };
        setRootCauses(rootCauses);
    };

    // Load the program state based on the infromation available
    const setProgramState = (args) => {
        if (args.executionTree && args.behavior) {
            setMode("BEHAVIORAL");
        } else if (args.executionTree) {
            setMode("EXECUTION");
        } else {
            setMode("STACK");
        }
    };

    // If the user chooses execution mode, load the full execution tree.
    useEffect(() => {
        if (mode === "EXECUTION") {
            setExecutionTree(executionTreeFull);
        }
    }, [mode]);

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
                setProgramState(event.data.args);
                setExecutionTree(event.data.args.executionTree);
                setExecutionTreeFull(event.data.args.executionTreeFull);
                setBehavior(event.data.args.behavior);
                saveRootCauses(event.data.args.executionTree);
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
                                                value={{executionTree, setExecutionTree,
                                                    executionTreeFull, behavior, activeBehavior,
                                                    setActiveBehavior, semanticState,
                                                    setSemanticState, rootCauses,
                                                }}>
                                                <ActionsContext.Provider
                                                    value={{actions, mode, setMode, setActions}}>
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
