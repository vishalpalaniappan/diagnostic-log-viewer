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
        <div className="d-flex flex-column" style={{marginTop: "5px", paddingLeft: "28px"}}>
            {exceptionMessage}
        </div>
    );
    return domNode;
};

export {getExceptionMessage};
