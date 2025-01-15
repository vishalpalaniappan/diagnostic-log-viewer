import React, {useEffect, useRef} from "react";

import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import PropTypes from "prop-types";
import {createRoot} from "react-dom/client";

import "./MonacoInstance.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

MonacoInstance.propTypes = {
    content: PropTypes.string,
    lineNumber: PropTypes.number,
    exceptions: PropTypes.array,
};


/**
 * Contains the monaco editor.
 * @return {JSX.Element}
 */
export function MonacoInstance ({content, lineNumber, exceptions}) {
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
            editorRef.current.revealLineInCenter(lineNumber);
            editorRef.current.deltaDecorations([], [
                {
                    range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                    options: {
                        isWholeLine: true,
                        className: "selectedLine",
                    },
                },
            ]);

            if (exceptions) {
                const exceptionMessage = exceptions[0][0][1];
                editorRef.current.changeViewZones(function (changeAccessor) {
                    const domNode = document.createElement("div");
                    domNode.className = "exception-message";
                    const l = editorRef.current.getModel().getLineContent(lineNumber);
                    const numSpaces = l.length - l.trimStart().length;
                    createRoot(domNode).render(
                        <div className="d-flex" style={{marginTop: "5px"}}>
                            <div className="d-flex flex-row">
                                <span >
                                    Exception: {exceptionMessage}
                                </span>
                            </div>
                        </div>
                    );
                    changeAccessor.addZone({
                        afterLineNumber: lineNumber,
                        afterColumn: numSpaces,
                        heightInPx: 50,
                        domNode: domNode,
                    });
                });
            }
        }
    }, [content, lineNumber]);

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
