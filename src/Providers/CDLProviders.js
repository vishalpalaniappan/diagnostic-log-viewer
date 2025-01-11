import React, {useCallback, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";

import CDL_WORKER_PROTOCOL from "../Services/CDL_WORKER_PROTOCOL";
import AppStateContext from "./AppStateContext";

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
            default:
                break;
        }
    });

    return (
        <AppStateContext.Provider value={{appState, setAppState}}>
            {children}
        </AppStateContext.Provider>
    );
};

export default CDLProviders;
