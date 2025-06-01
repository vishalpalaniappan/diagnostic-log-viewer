import React, {useContext, useEffect, useRef, useState} from "react";

import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import ActiveFileContext from "../../Providers/ActiveFileContext";
import BreakpointsContext from "../../Providers/BreakpointsContext";
import FileTreeContext from "../../Providers/FileTreeContext";
import StackContext from "../../Providers/StackContext";
import PositionStateContext from "../../Providers/StackPositionContext";
import WorkerContext from "../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../Services/CDL_WORKER_PROTOCOL";
import {getExceptionMessage, getLineDecoration} from "./helper";

import "./MonacoInstance.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

/**
 * Contains the monaco editor.
 * @return {JSX.Element}
 */
export function MonacoInstance () {
    // Consume contexts
    const {stackPosition} = useContext(PositionStateContext);
    const {stack} = useContext(StackContext);
    const {fileTree} = useContext(FileTreeContext);
    const {breakPoints} = useContext(BreakpointsContext);
    const {activeFile} = useContext(ActiveFileContext);
    const {cdlWorker} = useContext(WorkerContext);

    // Component State variables
    const [zoneIds, setZoneIds] = useState([]);
    const [breakPointDecorations, setBreakPointDecorations] = useState([]);
    const [lineDecorations, setLineDecorations] = useState([]);

    // Refs
    // ActiveFileRef is used to access active file in callback
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const activeFileRef = useRef();


    loader.config({monaco});

    /**
     * Called when editor is finished mounting.
     * @param {object} editor
     * @param {object} monaco
     */
    const handleEditorDidMount =(editor, monaco) => {
        monacoRef.current = monaco;
        editorRef.current = editor;
        editorRef.current.onMouseDown(onMonacoMouseDown);
        editorRef.current.onMouseMove(onMonacoMouseMove);
        editorRef.current.onMouseLeave(onMonacoMouseLeave);
    };

    useEffect(() => {
        activeFileRef.current = activeFile;
        loadContent();
    }, [activeFile, stackPosition, stack]);

    useEffect(() => {
        drawBreakPoints();
    }, [breakPoints]);


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
        setLineDecorations(
            editorRef.current.deltaDecorations(lineDecorations, [
                {
                    range: new monaco.Range(lineno, 1, lineno, 1),
                    options: {isWholeLine: true, className: className},
                },
            ])
        );
    };

    /**
     * This function loads the content into the monaco editor.
     *  - Highlight stack position if it is in current active file
     *  - Clear existing exceptions and load new ones if they exist
     *  - Drawbreak points
     */
    const loadContent = () => {
        if (editorRef?.current) {
            if (stack && activeFile) {
                clearExceptions();
                editorRef.current.setValue(fileTree[activeFile]);

                if (stack.callStack[0].filePath === activeFile) {
                    selectLine(stack.callStack[0].lineno, "selectedLine");
                    addException(stack.callStack[0]);
                }

                if (stackPosition > 0 && activeFile === stack.callStack[stackPosition].filePath) {
                    selectLine(stack.callStack[stackPosition].lineno, "stackLine");
                    addException(stack.callStack[stackPosition]);
                }

                drawBreakPoints();
            } else {
                editorRef.current.setValue("Loading content...");
            }
        }
    };


    /**
     * Draws the active breakpoints
     */
    const drawBreakPoints = () => {
        if (editorRef?.current && breakPoints) {
            const decos = [];
            for (const breakPoint of breakPoints) {
                if (breakPoint.filePath === activeFile) {
                    const className = (breakPoint.enabled)?"glyph-debugger-icon":"glyph-debugger-icon-disabled";
                    decos.push(getLineDecoration(breakPoint.lineno, className) );
                }
            }
            setBreakPointDecorations(editorRef.current.deltaDecorations(breakPointDecorations, decos));
        }
    };

    /**
     * Callback when mouse is moved on monaco instance.
     * TODO: Move hover decoration variables into react state
     * @param {Event} e
     */
    let hoverDecorations = [];
    let currHoverLineNumber;
    const onMonacoMouseMove = (e) => {
        if (e.target.type === 2) {
            if (currHoverLineNumber != e.target.position.lineNumber) {
                const decoration = getLineDecoration(e.target.position.lineNumber, "glyph-debugger-icon-hover");
                hoverDecorations = editorRef.current.deltaDecorations(hoverDecorations, [decoration]);
                currHoverLineNumber = e.target.position.lineNumber;
            }
        } else {
            hoverDecorations = editorRef.current.deltaDecorations(hoverDecorations, []);
        }
    };

    /**
     * Callback when mouse exits the monaco editor.
     * @param {Event} e
     */
    const onMonacoMouseLeave = (e) => {
        hoverDecorations = editorRef.current.deltaDecorations(hoverDecorations, []);
        currHoverLineNumber = null;
    };

    /**
     * Callback when mouse down event occurs on monaco editor.
     * @param {Event} e
     */
    const onMonacoMouseDown = (e) => {
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
