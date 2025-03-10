import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";

import CDL_WORKER_PROTOCOL from "../Services/CDL_WORKER_PROTOCOL";
import ActiveFileContext from "./ActiveFileContext";
import BreakpointsContext from "./BreakpointsContext";
import FileTreeContext from "./FileTreeContext";
import GlobalVariablesContext from "./GlobalVariablesContext";
import HeaderMetadataContext from "./HeaderMetadataContext";
import StackContext from "./StackContext";
import StackPositionContext from "./StackPositionContext";
import VariablesContext from "./VariablesContext";
import WorkerContext from "./WorkerContext";

CDLProviders.propTypes = {
    children: PropTypes.object,
    fileInfo: PropTypes.string,
};

/**
 * Provides all contexts consumed by the application.
 * @param {JSX} children
 * @param {string} fileInfo
 * @return {JSX}
 */
function CDLProviders ({children, fileInfo}) {
    const [isLoading, setIsLoading] = useState(false);
    const [activeFile, setActiveFile] = useState();
    const [stack, setStack] = useState();
    const [stackPosition, setStackPosition] = useState();
    const [localVariables, setLocalVariables] = useState();
    const [globalVariables, setGlobalVariables] = useState();
    const [headerMetadata, setHeaderMetadata] = useState();
    const [fileTree, setFileTree] = useState();
    const [breakPoints, setBreakPoints] = useState();

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
        if (cdlWorker?.current && stackPosition !== undefined && stack?.[stackPosition]) {
            setActiveFile(stack[stackPosition].filePath);
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
                args: {
                    position: stack[stackPosition].position,
                },
            });
        } else {
            console.warn("Invalid stack position or stack not initialized");
        }
    }, [stackPosition, stack]);

    // Resets the state variables before loading new file.
    const initializeStates = () => {
        setFileTree(undefined);
        setLocalVariables(undefined);
        setGlobalVariables(undefined);
        setStackPosition(undefined);
        setStack(undefined);
        setActiveFile(undefined);
        setBreakPoints(undefined);
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
                    }
                });
            } catch (error) {
                console.error("Failed to initialize worker:", error);
            }
        }
    }, [fileInfo]);

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
                setStack(event.data.args.callStack);
                setStackPosition(0);
                break;
            case CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK:
                setLocalVariables(event.data.args.localVariables);
                setGlobalVariables(event.data.args.globalVariables);
                break;
            case CDL_WORKER_PROTOCOL.BREAKPOINTS:
                setBreakPoints(event.data.args.breakpoints);
                break;
            case CDL_WORKER_PROTOCOL.HEADER_METADATA:
                setHeaderMetadata(event.data.args);
                break;
            default:
                break;
        }
    });

    return (
        <StackPositionContext.Provider value={{stackPosition, setStackPosition}}>
            <FileTreeContext.Provider value={{fileTree}}>
                <WorkerContext.Provider value={{cdlWorker}}>
                    <GlobalVariablesContext.Provider value={{globalVariables}}>
                        <VariablesContext.Provider value={{localVariables}}>
                            <BreakpointsContext.Provider value={{breakPoints}}>
                                <StackContext.Provider value={{stack}}>
                                    <ActiveFileContext.Provider value={{activeFile, setActiveFile}}>
                                        <HeaderMetadataContext.Provider value={{headerMetadata}}>
                                            {children}
                                        </HeaderMetadataContext.Provider>
                                    </ActiveFileContext.Provider>
                                </StackContext.Provider>
                            </BreakpointsContext.Provider>
                        </VariablesContext.Provider>
                    </GlobalVariablesContext.Provider>
                </WorkerContext.Provider>
            </FileTreeContext.Provider>
        </StackPositionContext.Provider>
    );
};

export default CDLProviders;
