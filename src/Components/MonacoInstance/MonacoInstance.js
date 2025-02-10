import React, {useContext, useEffect, useRef, useState} from "react";

import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import PropTypes from "prop-types";

import CDL_WORKER_PROTOCOL from "../../Services/CDL_WORKER_PROTOCOL";

import ActiveFileContext from "../../Providers/ActiveFileContext";
import FileTreeContext from "../../Providers/FileTreeContext";
import StackContext from "../../Providers/StackContext";
import PositionStateContext from "../../Providers/StackPositionContext";
import WorkerContext from "../../Providers/WorkerContext";
import BreakpointsContext from "../../Providers/BreakpointsContext";
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
export function MonacoInstance () {
    const [zoneIds, setZoneIds] = useState([]);
    const {stackPosition} = useContext(PositionStateContext);
    const {stack} = useContext(StackContext);
    const {fileTree} = useContext(FileTreeContext);
    const {breakPoints} = useContext(BreakpointsContext);
    const {activeFile, setActiveFile} = useContext(ActiveFileContext);
    const {cdlWorker} = useContext(WorkerContext);

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const activeFileRef = useRef();

    /**
     * Add's exceptions to the given position.
     * @param {Number} stackPosition
     */
    const addException = (stackPosition) => {
        if (stackPosition.exceptions) {
            editorRef.current.changeViewZones(function (changeAccessor) {
                const exceptionZoneInfo = getExceptionMessage(stackPosition.exceptions);
                const zoneId = changeAccessor.addZone({
                    afterLineNumber: stackPosition.lineno,
                    heightInPx: ((exceptionZoneInfo.numLines + 1) * 18),
                    domNode: exceptionZoneInfo.domNode,
                });
                setZoneIds([...zoneIds, zoneId]);
            });
        }
    };

    /**
     * Clear the current exceptions.
     */
    const clearExceptions = () => {
        if (zoneIds && zoneIds.length > 0) {
            editorRef.current.changeViewZones((changeAccessor) => {
                zoneIds.forEach((zoneId, index) => {
                    changeAccessor.removeZone(zoneId);
                });
                setZoneIds([]);
            });
        }
    };

    /**
     * This function selects the given line and applys the given class.
     * @param {Number} lineno Line number to select.
     * @param {String} className Class to apply to the selected line.
     */
    const selectLine = (lineno, className) => {
        editorRef.current.revealLineInCenter(lineno);
        editorRef.current.deltaDecorations([], [
            {
                range: new monaco.Range(lineno, 1, lineno, 1),
                options: {isWholeLine: true, className: className},
            },
        ]);
    };

    /**
     * This function loads the content into the monaco editor.
     *  - Highlight stack position if it is in current active file
     *  - Clear existing exceptions and load new ones if they exist
     */
    const loadContent = () => {
        if (editorRef?.current && stack) {
            clearExceptions();
            editorRef.current.setValue(fileTree[activeFile]);

            if (stack[0].filePath === activeFile) {
                selectLine(stack[0].lineno, "selectedLine");
                addException(stack[0]);
            }

            if (stackPosition > 0 && activeFile === stack[stackPosition].filePath) {
                selectLine(stack[stackPosition].lineno, "stackLine");
                addException(stack[stackPosition]);
            }

            if (breakPoints) {
                for (const breakPoint of breakPoints) {
                    if (breakPoint.filePath === activeFile) {
                        editorRef.current.createDecorationsCollection([
                            {
                                range: new monaco.Range(
                                    breakPoint.lineno, 1,breakPoint.lineno, 1
                                ),
                                options: {
                                    glyphMarginClassName: "glyph-debugger-line",
                                },
                            },
                        ]);
                    }
                }
            }
        }
    };

    useEffect(() => {
        loadContent();
    }, [stackPosition, stack, activeFile, breakPoints]);

    useEffect(() => {
        activeFileRef.current = activeFile;
    }, [activeFile]);


    loader.config({monaco});

    /**
     * Called when editor is finished mounting.
     * @param {object} editor
     * @param {object} monaco
     */
    const handleEditorDidMount =(editor, monaco) => {
        monacoRef.current = monaco;
        editorRef.current = editor;
        editorRef.current.onMouseDown(toggleBreakpoint);
    };

    /**
     * Toggles a breakpoint when glyph margin is clicked
     * @param {Event} e 
     */
    const toggleBreakpoint = (e) => {
        if (activeFileRef.current && e.target.type === 2) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.TOGGLE_BREAKPOINT,
                args: {
                    fileName: activeFileRef.current,
                    lineNumber: e.target.position.lineNumber,  
                },
            });
        }
    };

    return (
        <Editor
            defaultValue="Loading content..."
            theme={"vs-dark"}
            onMount={handleEditorDidMount}
            options={{
                "renderWhitespace": "none",
                "wordWrap": "on",
                "scrollBeyondLastLine": false,
                "glyphMargin": true,
                "readOnly": true,
            }}
            language="python"
        />
    );
}
