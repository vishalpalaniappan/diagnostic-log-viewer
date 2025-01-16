import React, {useContext, useEffect, useState} from "react";

import FileTreeContext from "../../../Providers/FileTreeContext";
import PositionStateContext from "../../../Providers/PositionStateContext";
import StackStateContext from "../../../Providers/StackStateContext";
import {MonacoInstance} from "./MonacoInstance/MonacoInstance";
import {Tab} from "./Tab/Tab";

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

    const [files, setFiles] = useState();
    const [content, setContent] = useState("Loading...");
    const [lineNumber, setLineNumber] = useState(1);
    const [exceptions, setExceptions] = useState();
    const [tabs, setTabs] = useState(<></>);

    // Consume providers
    useEffect(() => {
        if (positionState && positionState.activeFile) {
            setContent(fileTree[positionState.activeFile].source);
            setLineNumber(positionState.lineno);
            setExceptions(positionState.exceptions);
        }
    }, [positionState]);

    useEffect(() => {
        if (stackPositionState && stackPositionState.activeFile) {
            setContent(fileTree[stackPositionState.activeFile].source);
            setLineNumber(stackPositionState.lineno);
            setExceptions(stackPositionState.exceptions);
        }
    }, [stackPositionState]);

    useEffect(() => {
        if (fileTree) {
            setFiles(Object.keys(fileTree));
        }
    }, [fileTree]);

    // React to state changes
    useEffect(() => {
        if (files) {
            const tabs = files.map((file, index) => {
                return <Tab key={index} fileName={file}></Tab>;
            });
            setTabs(tabs);
        }
    }, [files]);

    // TODO: Reimplement scroll bar for tabs, I don't like
    // the way I implemented it now.
    return (
        <div className="file-view-container d-flex flex-column">
            <div className="tabs d-flex">
                {tabs}
            </div>
            <div className="editor d-flex flex-grow-1">
                <MonacoInstance
                    content={content}
                    lineNumber={lineNumber}
                    exceptions={exceptions}
                />
            </div>
        </div>
    );
}
