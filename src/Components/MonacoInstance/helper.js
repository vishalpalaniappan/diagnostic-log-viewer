import React from "react";

import {createRoot} from "react-dom/client";


/**
 * This function returns a DOM node which contains the excetption to be rendered
 * by the monaco instance. It also returns the number of lines to set the height
 * of the exception container.
 *
 * @param {Object} exception  Array containing the exception for the
 *                            current position.
 * @return {Object}
 */
const getExceptionMessage = (exception) => {
    const exceptionValue = exception[0];
    const exceptionMessage = [
        <span key={0} style={{marginBottom: "10px", whiteSpace: "pre-wrap"}}>
            {exceptionValue}
        </span>,
    ];

    const domNode = document.createElement("div");
    domNode.className = "exception-message";
    createRoot(domNode).render(
        <div className="d-flex flex-column" style={{marginTop: "5px", paddingLeft: "28px"}}>
            {exceptionMessage}
        </div>
    );
    return {
        domNode: domNode,
        numLines: exceptionValue.split("\n").length,
    };
};

export {getExceptionMessage};
