import React, {useContext, useEffect, useRef, useState} from "react";

import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import FileTreeContext from "../../../Providers/FileTreeContext";

import "./FileViewer.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

/**
 * Contains the monaco eiditor and file tabs.
 * @return {JSX.Element}
 */
export function FileViewer () {
    const {fileTree} = useContext(FileTreeContext);
    const [files, setFiles] = useState();

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    loader.config({monaco});

    /**
     * Called before the monaco editor is mounted.
     * @param {object} monaco
     */
    function handleEditorWillMount (monaco) {
    }

    /**
     * Called when editor is finished mounting.
     * @param {object} editor
     * @param {object} monaco
     */
    const handleEditorDidMount =(editor, monaco) => {
        monacoRef.current = monaco;
        editorRef.current = editor;
    };

    useEffect(() => {
        if (fileTree) {
            setFiles(Object.keys(fileTree));
        }
    }, [fileTree]);


    return (
        <div className="file-view-container d-flex flex-column">
            <div className="tabs d-flex">
            </div>
            <div className="editor d-flex flex-grow-1">
                <Editor
                    defaultValue="Loading content..."
                    theme={"vs-dark"}
                    beforeMount={handleEditorWillMount}
                    onMount={handleEditorDidMount}
                />
            </div>
        </div>
    );
}
