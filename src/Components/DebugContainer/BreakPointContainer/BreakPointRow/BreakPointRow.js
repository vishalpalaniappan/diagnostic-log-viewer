import React, {useContext, useEffect, useState} from "react";
import { Form } from 'react-bootstrap';
import PropTypes from "prop-types";
import {X} from "react-bootstrap-icons";

import WorkerContext from "../../../../Providers/WorkerContext";

import CDL_WORKER_PROTOCOL from "../../../../Services/CDL_WORKER_PROTOCOL";

import "./BreakPointRow.scss";

BreakPointRow.propTypes = {
    fileName: PropTypes.string,
    filePath: PropTypes.string,
    lineNumber: PropTypes.number,
    enabled: PropTypes.bool,
};

/**
 * Renders a breakpoint row.
 * @param {String} fileName
 * @param {String} filePath
 * @param {Number} lineNumber
 * @param {Boolean} enabled
 * @return {JSX}
 */
export function BreakPointRow ({index, fileName, filePath, lineNumber, enabled}) {

    const {cdlWorker} = useContext(WorkerContext);

    const toggleEnabled = (e) => {
        cdlWorker.current.postMessage({
            code: CDL_WORKER_PROTOCOL.ENABLE_BREAKPOINT,
            args: {
                fileName: filePath,
                lineNumber: lineNumber,  
                isEnabled: e.target.checked
            },
        });
    }

    const removeBreakpoint = (e) => {
        cdlWorker.current.postMessage({
            code: CDL_WORKER_PROTOCOL.TOGGLE_BREAKPOINT,
            args: {
                fileName: filePath,
                lineNumber: lineNumber,  
            },
        });

    }

    return (
        <div className="breakpoint-row w-100 d-flex flex-row" >

            <div className="check">
                <Form.Check type="checkbox" onChange={toggleEnabled} defaultChecked={enabled} />
            </div>
            
            {fileName}

            <div className="flex-grow-1 d-flex justify-content-end">
                <div className="pill">
                    {lineNumber}
                </div>
                <div className="close">
                    <X onMouseDown={removeBreakpoint} size={22}/>
                </div>
            </div>

        </div>
    );
}
