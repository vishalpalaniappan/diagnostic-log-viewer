import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";

import CDL_WORKER_PROTOCOL from "../Services/CDL_WORKER_PROTOCOL";
import AppStateContext from "./AppStateContext";
import FileTreeContext from "./FileTreeContext";
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
    const [appState, setAppState] = useState();
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
     * This function loads the metadata into the app state.
     * @param {Object} metadata
     */
    const loadPositionMetadata = (metadata) => {
        const currLt = metadata.currLtInfo;
        setAppState({
            "activeFile": currLt.lt.fileName,
            "lineno": currLt.lt.lineno,
            "callStack": metadata.callStack,
            "variableStack": metadata.variableStack,
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
            default:
                break;
        }
    });

    return (
        <AppStateContext.Provider value={{appState, setAppState}}>
            <FileTreeContext.Provider value={{fileTree}}>
                <WorkerContext.Provider value={{cdlWorker}}>
                    {children}
                </WorkerContext.Provider>
            </FileTreeContext.Provider>
        </AppStateContext.Provider>
    );
};

export default CDLProviders;
