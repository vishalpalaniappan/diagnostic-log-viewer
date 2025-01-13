import React, {useEffect, useRef} from "react";

import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import PropTypes from "prop-types";

import "./MonacoInstance.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

MonacoInstance.propTypes = {
    content: PropTypes.string,
};


/**
 * Contains the monaco editor.
 * @return {JSX.Element}
 */
export function MonacoInstance ({content}) {
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
        editorRef.current.setValue("test");
    };

    useEffect(() => {
        if (content && editorRef && editorRef.current) {
            editorRef.current.setValue(content);
        }
    }, [content]);

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
