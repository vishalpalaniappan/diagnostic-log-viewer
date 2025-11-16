import React, {useEffect, useRef} from "react";

import "./ExecutionTreeContainer.scss";

/**
 * @return {JSX.Element}
 */
export function ExecutionTreeContainer ({}) {
    const executionTreeContainer = useRef();
    const uiOptions = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = executionTreeContainer.current.clientHeight;
        uiOptions.current.style.height = height - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={executionTreeContainer} className="w-100 h-100 execution-tree-container">
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>
                Execution Tree
            </div>
            <div ref={uiOptions} className="w-100">
            </div>
        </div>
    );
}
