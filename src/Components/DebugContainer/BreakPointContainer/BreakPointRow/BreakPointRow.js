import React, {useContext, useEffect, useState} from "react";
import { Form } from 'react-bootstrap';
import PropTypes from "prop-types";
import {X} from "react-bootstrap-icons";

import WorkerContext from "../../../../Providers/WorkerContext";

import CDL_WORKER_PROTOCOL from "../../../../Services/CDL_WORKER_PROTOCOL";

import "./BreakPointRow.scss";

BreakPointRow.propTypes = {
    index: PropTypes.number,
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
    const [isEnabled, setIsEnabled] = useState();

    const toggleEnabled = (e) => {
        cdlWorker.current.postMessage({
            code: CDL_WORKER_PROTOCOL.TOGGLE_BREAKPOINT_ENABLED,
            args: {
                fileName: filePath,
                lineNumber: lineNumber
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

    useEffect(() => {
        setIsEnabled(enabled);
    }, [enabled]);

    return (
        <div className="breakpoint-row w-100 d-flex flex-row" >

            <div className="check">
                <Form.Check type="checkbox" onClick={toggleEnabled} defaultChecked={isEnabled} />
            </div>
            
            {filePath}

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
