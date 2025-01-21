import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";

import ActiveFileContext from "../../../../Providers/ActiveFileContext";
import StackContext from "../../../../Providers/StackContext";
import StackPositionContext from "../../../../Providers/StackPositionContext";
import WorkerContext from "../../../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../../../Services/CDL_WORKER_PROTOCOL";

import "./CallStackRow.scss";

CallStackRow.propTypes = {
    index: PropTypes.number,
    functionName: PropTypes.string,
    fileName: PropTypes.string,
    lineno: PropTypes.number,
    position: PropTypes.number,
};

/**
 * Renders a call stack row.
 * @param {String} functionName
 * @param {String} fileName
 * @param {Number} lineno
 * @param {Number} position
 * @return {JSX}
 */
export function CallStackRow ({index, functionName, fileName, lineno, position}) {
    const {stackPosition, setStackPosition} = useContext(StackPositionContext);
    const {stack} = useContext(StackContext);
    const {setActiveFile} = useContext(ActiveFileContext);

    const [rowStyle, setRowStyle] = useState();
    const [nameStyle, setNameStyle] = useState();

    /**
     * Callback when stack position is selected.
     * @param {Event} e
     */
    const selectStackPosition = (e) => {
        setActiveFile(stack[index].fileName);
        setStackPosition(index);
    };

    const setStyle = () => {
        const hasException = (stack[index].exceptions && stack[index].exceptions.length > 0);
        if (index === stackPosition) {
            setNameStyle();
            if (index === 0 && hasException) {
                setRowStyle({backgroundColor: "#420b0e"});
            } else if (index === 0) {
                setRowStyle({backgroundColor: "#4b4b18"});
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
        if (stack && index < stack.length) {
            setStyle();
        }
    }, [stack, stackPosition]);

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
