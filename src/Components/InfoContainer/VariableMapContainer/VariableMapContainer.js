import React, {useEffect, useRef} from "react";

import "./VariableMapContainer.scss";

/**
 * @return {JSX.Element}
 */
export function VariableMapContainer ({}) {
    const variableMapContainer = useRef();
    const uiOptions = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = variableMapContainer.current.clientHeight;
        uiOptions.current.style.height = height - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={variableMapContainer} className="w-100 h-100 variable-map-container">
            <div ref={uiOptions} className="w-100">
            </div>
        </div>
    );
}
