import React, {useEffect, useState} from "react";

import DropFile from "./Components/DropFile/DropFile";
import CDLProviders from "./Providers/CDLProviders";
import {Viewer} from "./Viewer/Viewer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

/**
 * Renders the application.
 *
 * @return {JSX.Element}
 */
export function App () {
    const APP_STATE = {
        FILE_PROMPT: 0,
        FILE_VIEW: 1,
    };

    const [appMode, setAppMode] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const filePath = urlParams.get("filePath");

        // If filePath is provided, then it is passed to the provider.
        // If filePath is not provided, a prompt to load the file is provided.
        if (filePath) {
            setFileInfo(filePath);
            setAppMode(APP_STATE.FILE_VIEW);
        } else {
            setAppMode(APP_STATE.FILE_PROMPT);
        }
    }, []);

    /**
     * Handles the file being changed
     * @param {File} file
     */
    const handleFileChange = (file) => {
        setFileInfo(file);
        setAppMode(APP_STATE.FILE_VIEW);
    };

    return (
        <DropFile handleFileDrop={handleFileChange}>
            {(APP_STATE.FILE_VIEW === appMode) &&
                <CDLProviders fileInfo={fileInfo}>
                    <Viewer/>
                </CDLProviders>
            }
        </DropFile>
    );
}
