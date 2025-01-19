import React, {useContext, useEffect, useRef, useState} from "react";

import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import PropTypes from "prop-types";

import ActiveFileContext from "../../Providers/ActiveFileContext";
import FileTreeContext from "../../Providers/FileTreeContext";
import StackContext from "../../Providers/StackContext";
import PositionStateContext from "../../Providers/StackPositionContext";
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
export function MonacoInstance ({}) {
    const [zoneId, setZoneId] = useState();
    const {stackPosition} = useContext(PositionStateContext);
    const {stack} = useContext(StackContext);
    const {fileTree} = useContext(FileTreeContext);
    const {activeFile} = useContext(ActiveFileContext);

    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    let decorations = [];

    const addException = (stackPosition) => {
        if (stackPosition.exceptions) {
            const exceptionMessage = stackPosition.exceptions[0][0][1];
            editorRef.current.changeViewZones(function (changeAccessor) {
                const zoneId = changeAccessor.addZone({
                    afterLineNumber: stackPosition.lineno,
                    heightInPx: 25,
                    domNode: getExceptionMessage(exceptionMessage),
                });
                setZoneId(zoneId);
            });
        } else {
            clearExceptions();
        }
    };

    const clearExceptions = () => {
        if (zoneId) {
            editorRef.current.changeViewZones((changeAccessor) => {
                changeAccessor.removeZone(zoneId);
                setZoneId(null);
            });
        }
    };

    const loadContent = () => {
        if (stack) {
            const currStack = stack[stackPosition];
            editorRef.current.setValue(fileTree[activeFile]);
            clearExceptions();
            if (activeFile === currStack.fileName) {
                const _class = (stackPosition === 0)?"selectedLine":"stackLine";
                editorRef.current.setValue(fileTree[currStack.fileName]);
                editorRef.current.revealLineInCenter(currStack.lineno);
                decorations = editorRef.current.deltaDecorations(decorations, [
                    {
                        range: new monaco.Range(currStack.lineno, 1, currStack.lineno, 1),
                        options: {
                            isWholeLine: true,
                            className: _class,
                            glyphMarginClassName: "bi bi-filetype-py",
                        },
                    },
                ]);
                addException(currStack);
            }
        }
    };

    useEffect(() => {
        loadContent();
    }, [stackPosition, stack, activeFile]);


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
