import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";

import ActiveFileContext from "../../../../Providers/ActiveFileContext";
import StackContext from "../../../../Providers/StackContext";
import StackPositionContext from "../../../../Providers/StackPositionContext";

import "./CallStackRow.scss";

CallStackRow.propTypes = {
    index: PropTypes.number,
    functionName: PropTypes.string,
    filePath: PropTypes.string,
    fileName: PropTypes.string,
    lineno: PropTypes.number,
    position: PropTypes.number,
    main: PropTypes.bool,
    threadId: PropTypes.string,
};

/**
 * Renders a call stack row.
 * @param {String} functionName
 * @param {String} filePath
 * @param {String} fileName
 * @param {Number} lineno
 * @param {Number} position
 * @param {Boolean} main
 * @param {String} threadId
 * @return {JSX}
 */
export function CallStackRow ({index, functionName, filePath, fileName, lineno, position, main, threadId}) {
    const {stackPosition, setStackPosition} = useContext(StackPositionContext);
    const {stacks, activeThread, setActiveThread, setStack} = useContext(StackContext);
    const {setActiveFile} = useContext(ActiveFileContext);

    const [rowStyle, setRowStyle] = useState();
    const [nameStyle, setNameStyle] = useState();

    /**
     * Callback when stack position is selected.
     * @param {Event} e
     */
    const selectStackPosition = (e) => {
        setActiveThread(threadId);
        setStack(stacks[threadId].stack);
        setActiveFile(stacks[threadId].stack.callStack[index].filePath);
        setStackPosition(index);
    };

    const setStyle = (currStack) => {
        const exceptions = currStack[index].exceptions;
        const hasException = (exceptions && exceptions.length > 0);
        if (index === stackPosition) {
            setNameStyle();
            if (index === 0 && hasException) {
                setRowStyle({backgroundColor: "#420b0e"});
            } else if (index === 0) {
                setRowStyle({backgroundColor: "#373700"});
            } else {
                setRowStyle({backgroundColor: "#184b2d"});
            }
        } else {
            setRowStyle();
            if (hasException) {
                setNameStyle({color: "#ff8c92"});
            } else {
                setNameStyle({color: "white"});
            }
        }
    };

    useEffect(() => {
        const currStack = stacks[threadId].stack.callStack;
        if (stacks && index < currStack.length) {
            if (activeThread == threadId) {
                setStyle(currStack);
            } else {
                setRowStyle({});
                setNameStyle({});
            }
        }
    }, [stacks, stackPosition, activeThread]);

    return (
        <div style={rowStyle} onClick={(e) => selectStackPosition(e)}
            className="stack-row w-100 d-flex flex-row">
            <div style={nameStyle}>{functionName}</div>
            <div className="flex-grow-1 d-flex justify-content-end">
                <div className="file-name">{fileName}</div>
                <div className="pill">{lineno}:1</div>
            </div>
        </div>
    );
}
