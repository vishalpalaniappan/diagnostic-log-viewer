import React, {useContext, useEffect, useState} from "react";

import FileTreeContext from "../../../Providers/FileTreeContext";
import {MonacoInstance} from "./MonacoInstance/MonacoInstance";

import "./FileViewer.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

/**
 * Contains the monaco eiditor and file tabs.
 * @return {JSX.Element}
 */
export function FileViewer () {
    const {fileTree} = useContext(FileTreeContext);
    const [files, setFiles] = useState();

    useEffect(() => {
        if (fileTree) {
            setFiles(Object.keys(fileTree));
        }
    }, [fileTree]);


    return (
        <div className="file-view-container d-flex flex-column">
            <div className="tabs d-flex">
                {files}
            </div>
            <div className="editor d-flex flex-grow-1">
                <MonacoInstance content={"asdf"} />
            </div>
        </div>
    );
}
