import React from "react";

import {createRoot} from "react-dom/client";

const getExceptionMessage = (exceptionMessage) => {
    const domNode = document.createElement("div");
    domNode.className = "exception-message";
    domNode.onmousemove = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };
    createRoot(domNode).render(
        <div className="d-flex" style={{marginTop: "5px"}}>
            <div className="d-flex flex-row">
                <span>
                    Exception: {exceptionMessage}
                </span>
            </div>
        </div>
    );
    return domNode;
};

export {getExceptionMessage};
