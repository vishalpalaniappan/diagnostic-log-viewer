import React from "react";

import PropTypes from "prop-types";

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
    const goToLine = (e) => {
        console.log("Going to line:", position);
    };

    return (
        <div
            onClick={(e) => goToLine(e)}
            className="stack-row w-100 d-flex flex-row">
            <div className="w-50 ">{functionName}</div>
            <div className="w-50 d-flex justify-content-end">
                <div className="file-name">{fileName}</div>
                <div className="pill">{lineno}:1</div>
            </div>
        </div>
    );
}
