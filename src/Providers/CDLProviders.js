import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";

import CDL_WORKER_PROTOCOL from "../Services/CDL_WORKER_PROTOCOL";
import FileTreeContext from "./FileTreeContext";
import PositionStateContext from "./PositionStateContext";
import StackStateContext from "./StackStateContext";
import VariableStateContext from "./VariableStateContext";
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
    const [positionState, setPositionState] = useState();
    const [stackPositionState, setStackPositionState] = useState();
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

    /**
     * This function loads the variables into the variable state.
     * @param {Object} variables
     */
    const loadVariables = (variables) => {
        setVariables(variables);
    };

    /**
     * This function loads the metadata into the app state.
     * @param {Object} metadata
     */
    const loadPositionMetadata = (metadata) => {
        const currLt = metadata.currLtInfo;
        setPositionState({
            "activeFile": currLt.lt.fileName,
            "lineno": currLt.lt.lineno,
            "callStack": metadata.callStack,
            "exceptions": metadata.exceptions,
        });
    };

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
                loadPositionMetadata(event.data.args);
                break;
            case CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK:
                loadVariables(event.data.args.variableStack);
                break;
            case CDL_WORKER_PROTOCOL.GET_STACK_POSITION_DATA:
                const currLt = event.data.args.currLtInfo;
                setStackPositionState({
                    "activeFile": currLt.lt.fileName,
                    "lineno": currLt.lt.lineno,
                    "exceptions": event.data.args.exceptions,
                });
                break;
            default:
                break;
        }
    });

    return (
        <PositionStateContext.Provider value={{positionState}}>
            <FileTreeContext.Provider value={{fileTree}}>
                <WorkerContext.Provider value={{cdlWorker}}>
                    <VariableStateContext.Provider value={{variables}}>
                        <StackStateContext.Provider value={{stackPositionState}}>
                            {children}
                        </StackStateContext.Provider>
                    </VariableStateContext.Provider>
                </WorkerContext.Provider>
            </FileTreeContext.Provider>
        </PositionStateContext.Provider>
    );
};

export default CDLProviders;
