import React, {useContext, useEffect, useState} from "react";

import AppStateContext from "../../../Providers/AppStateContext";
import FileTreeContext from "../../../Providers/FileTreeContext";
import {MonacoInstance} from "./MonacoInstance/MonacoInstance";
import {Tab} from "./Tab/Tab";

import "./FileViewer.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

/**
 * Contains the monaco eiditor and file tabs.
 * @return {JSX.Element}
 */
export function FileViewer () {
    const {appState} = useContext(AppStateContext);
    const {fileTree} = useContext(FileTreeContext);

    const [files, setFiles] = useState();
    const [content, setContent] = useState("Loading...");
    const [tabs, setTabs] = useState(<></>);

    // Consume providers
    useEffect(() => {
        if (appState && appState.activeFile) {
            setContent(fileTree[appState.activeFile].source);
        }
    }, [appState]);

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
                <MonacoInstance content={content} />
            </div>
        </div>
    );
}
