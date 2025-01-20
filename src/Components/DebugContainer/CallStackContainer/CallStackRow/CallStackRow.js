import React, {useContext, useEffect, useRef} from "react";

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
export function CallStackRow({index, functionName, fileName, lineno, position}) {
    const rowRef = useRef();

    const {cdlWorker} = useContext(WorkerContext);
    const {stackPosition, setStackPosition} = useContext(StackPositionContext);
    const {stack} = useContext(StackContext);
    const {setActiveFile} = useContext(ActiveFileContext);

    /**
     * Callback when stack position is selected.
     * @param {Event} e
     */
    const selectStackPosition = (e) => {
        if (cdlWorker) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
                args: {
                    position: position,
                },
            });
        }
        setActiveFile(stack[index].fileName);
        setStackPosition(index);
    };

    // Update row style based on the active stack position
    useEffect(() => {
        if (stackPosition === index) {
            if (index === 0) {
                rowRef.current.classList.add("active-row-first");
            } else {
                rowRef.current.classList.add("active-row");
            }
        } else {
            rowRef.current.classList.remove("active-row");
            rowRef.current.classList.remove("active-row-first");
        }
    }, [stackPosition]);

    return (
        <div
            ref={rowRef}
            onClick={(e) => selectStackPosition(e)}
            className="stack-row w-100 d-flex flex-row">
            <div className="w-50 ">{functionName}</div>
            <div className="w-50 d-flex justify-content-end">
                <div className="file-name">{fileName}</div>
                <div className="pill">{lineno}:1</div>
            </div>
        </div>
    );
}
