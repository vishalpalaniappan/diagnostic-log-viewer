import React, {useEffect, useRef, useState} from "react";

import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import PropTypes from "prop-types";

import {getExceptionMessage} from "./helper";

import "./MonacoInstance.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

MonacoInstance.propTypes = {
    activeFile: PropTypes.string,
    content: PropTypes.string,
    stackPositionInfo: PropTypes.object,
    debuggerPositionInfo: PropTypes.object,
};


/**
 * Contains the monaco editor.
 * @return {JSX.Element}
 */
export function MonacoInstance ({activeFile, content, stackPositionInfo, debuggerPositionInfo}) {
    const [zoneId, setZoneId] = useState();

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
        editorRef.current.setValue("");
    };

    useEffect(() => {
        if (content && editorRef && editorRef.current) {
            editorRef.current.setValue(content);
        }
    }, [content]);

    useEffect(() => {
        if (content && editorRef && editorRef.current) {
            editorRef.current.setValue(content);
            if (debuggerPositionInfo && activeFile === debuggerPositionInfo.fileName) {
                const lineno = debuggerPositionInfo.lineno;
                editorRef.current.deltaDecorations([], [{
                    range: new monaco.Range(lineno, 1, lineno, 1),
                    options: {isWholeLine: true, className: "selectedLine"},
                }]);
                editorRef.current.revealLineInCenter(lineno);
            }
            if (stackPositionInfo && activeFile === stackPositionInfo.fileName) {
                const debuggerLineno = debuggerPositionInfo.lineno;
                const lineno = stackPositionInfo.lineno;
                const lineClass = (debuggerLineno === lineno)?"selectedLine":"stackLine";
                editorRef.current.deltaDecorations([], [{
                    range: new monaco.Range(lineno, 1, lineno, 1),
                    options: {isWholeLine: true, className: lineClass},
                }]);
                editorRef.current.revealLineInCenter(lineno);
            };
        };
    }, [stackPositionInfo, debuggerPositionInfo]);

    const monacoOptions = {
        "renderWhitespace": "none",
        "wordWrap": "on",
        "scrollBeyondLastLine": false,
        "glyphMargin": true,
    };

    return (
        <Editor
            defaultValue="Loading content..."
            theme={"vs-dark"}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            options={monacoOptions}
            language="python"
        />
    );
}
