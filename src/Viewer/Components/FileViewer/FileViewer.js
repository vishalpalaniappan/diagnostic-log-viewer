import React, {useContext, useEffect, useState} from "react";

import FileTreeContext from "../../../Providers/FileTreeContext";
import PositionStateContext from "../../../Providers/PositionStateContext";
import StackStateContext from "../../../Providers/StackStateContext";
import {MonacoInstance} from "./MonacoInstance/MonacoInstance";
import {Tabs} from "./Tabs/Tabs";

import "./FileViewer.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

/**
 * Contains the monaco eiditor and file tabs.
 * @return {JSX.Element}
 */
export function FileViewer () {
    const {stackPositionState} = useContext(StackStateContext);
    const {positionState} = useContext(PositionStateContext);
    const {fileTree} = useContext(FileTreeContext);

    const [activeFile, setActiveFile] = useState("Loading...");
    const [debuggerPositionInfo, setDebuggerPositionInfo] = useState();
    const [stackPositionInfo, setStackPositionInfo] = useState();
    const [content, setContent] = useState("");

    // Consume providers
    useEffect(() => {
        if (positionState && positionState.activeFile) {
            setActiveFile(positionState.activeFile);
            setContent(fileTree[positionState.activeFile].source);
            setDebuggerPositionInfo({
                fileName: positionState.activeFile,
                lineno: positionState.lineno,
                exceptions: positionState.exceptions,
            });
        }
    }, [positionState]);

    useEffect(() => {
        if (stackPositionState && stackPositionState.activeFile) {
            setActiveFile(stackPositionState.activeFile);
            setContent(fileTree[stackPositionState.activeFile].source);
            setStackPositionInfo({
                fileName: stackPositionState.activeFile,
                lineno: stackPositionState.lineno,
                exceptions: stackPositionState.exceptions,
            });
        }
    }, [stackPositionState]);


    return (
        <div className="file-view-container d-flex flex-column">
            <Tabs />
            <div className="editor d-flex flex-grow-1">
                <MonacoInstance
                    activeFile={activeFile}
                    content={content}
                    stackPositionInfo={stackPositionInfo}
                    debuggerPositionInfo={debuggerPositionInfo}
                />
            </div>
        </div>
    );
}
