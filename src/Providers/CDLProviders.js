import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";

import CDL_WORKER_PROTOCOL from "../Services/CDL_WORKER_PROTOCOL";
import ActiveFileContext from "./ActiveFileContext";
import FileTreeContext from "./FileTreeContext";
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
    const [activeFile, setActiveFile] = useState();
    const [stack, setStack] = useState();
    const [stackPosition, setStackPosition] = useState();
    const [variables, setVariables] = useState();
    const [fileTree, setFileTree] = useState();

    const cdlWorker = useRef(null);

    // Terminate worker when component is destroyed.
    useEffect(() => {
        return () => {
            if (cdlWorker.current) {
                cdlWorker.current.terminate();
            }
        };
    }, []);

    // Create worker to handle file.
    useEffect(() => {
        if (fileInfo) {
            if (cdlWorker.current) {
                cdlWorker.current.terminate();
            }
            cdlWorker.current = new Worker(new URL("../Services/cdlWorker.js", import.meta.url));
            cdlWorker.current.onmessage = handleWorkerMessage;
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.LOAD_FILE,
                fileInfo: fileInfo,
            });
        }
    }, [fileInfo]);

    /**
     * Handles message from the worker.
     * @param {object} event
     */
    const handleWorkerMessage = useCallback((event) => {
        switch (event.data.code) {
            case CDL_WORKER_PROTOCOL.GET_METADATA:
                setFileTree(event.data.args.fileTree);
                break;
            case CDL_WORKER_PROTOCOL.GET_POSITION_DATA:
                setStack(event.data.args.callStack);
                setStackPosition(0);
                setActiveFile(event.data.args.callStack[0].fileName);
                break;
            case CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK:
                setVariables(event.data.args.variableStack);
                break;
            case CDL_WORKER_PROTOCOL.GET_STACK_POSITION_DATA:
                break;
            default:
                break;
        }
    });

    return (
        <StackPositionContext.Provider value={{stackPosition, setStackPosition}}>
            <FileTreeContext.Provider value={{fileTree}}>
                <WorkerContext.Provider value={{cdlWorker}}>
                    <VariablesContext.Provider value={{variables}}>
                        <StackContext.Provider value={{stack}}>
                            <ActiveFileContext.Provider value={{activeFile, setActiveFile}}>
                                {children}
                            </ActiveFileContext.Provider>
                        </StackContext.Provider>
                    </VariablesContext.Provider>
                </WorkerContext.Provider>
            </FileTreeContext.Provider>
        </StackPositionContext.Provider>
    );
};

export default CDLProviders;
