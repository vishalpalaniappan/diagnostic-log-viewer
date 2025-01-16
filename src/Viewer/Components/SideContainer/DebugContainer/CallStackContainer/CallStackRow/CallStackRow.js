import React, {useContext} from "react";

import PropTypes from "prop-types";

import WorkerContext from "../../../../../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../../../../../Services/CDL_WORKER_PROTOCOL";

import "./CallStackRow.scss";

CallStackRow.propTypes = {
    functionName: PropTypes.string,
    fileName: PropTypes.string,
    lineno: PropTypes.number,
    position: PropTypes.number,
};


/**
 * test
 * @param {String} functionName
 * @param {String} fileName
 * @param {Number} lineno
 * @param {Number} position
 * @return {JSX}
 */
export function CallStackRow({functionName, fileName, lineno, position}) {
    const {cdlWorker} = useContext(WorkerContext);
    const selectStackPosition = (e) => {
        if (cdlWorker) {
            cdlWorker.current.postMessage({
                code: CDL_WORKER_PROTOCOL.GET_STACK_POSITION_DATA,
                args: {
                    position: position,
                },
            });
        }
    };

    return (
        <div
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
