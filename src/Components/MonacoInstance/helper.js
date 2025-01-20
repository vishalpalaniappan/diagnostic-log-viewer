import React from "react";

import {createRoot} from "react-dom/client";

const getExceptionMessage = (exceptions) => {
    const exceptionMessage = [
        <span key={0} style={{marginBottom: "10px"}}>
            Exception has occured: <b>{exceptions[0][0][1]}</b>
        </span>,
    ];
    exceptions[0].forEach((exception, index) => {
        const lt = exception[0];
        const file = lt.lt.fileName;
        const lineno = lt.lt.lineno;
        const syntax = lt.lt.syntax;
        const funcName = lt.lt.funcName;
        const key = exceptionMessage.length;
        exceptionMessage.push(
            <span key={key}>&emsp;File: {file}, line {lineno}, in {funcName}:</span>
        );
        exceptionMessage.push(<span key={key + 1}>&emsp;&emsp;{syntax}</span>);
    });

    const domNode = document.createElement("div");
    domNode.className = "exception-message";
    domNode.onmousemove = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };
    createRoot(domNode).render(
        <div className="d-flex flex-column" style={{marginTop: "5px", paddingLeft: "28px"}}>
            {exceptionMessage}
        </div>
    );
    return {
        domNode: domNode,
        numLines: exceptionMessage.length + 2,
    };
};

export {getExceptionMessage};
