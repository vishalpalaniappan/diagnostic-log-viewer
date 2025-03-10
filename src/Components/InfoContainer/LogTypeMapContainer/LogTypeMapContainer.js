import React, {useEffect, useRef} from "react";

import "./LogTypeMapContainer.scss";

/**
 * @return {JSX.Element}
 */
export function LogTypeMapContainer ({}) {
    const logtypeMapContainer = useRef();
    const uiOptions = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = logtypeMapContainer.current.clientHeight;
        uiOptions.current.style.height = height - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={logtypeMapContainer} className="w-100 h-100 logtype-map-container">
            <div ref={uiOptions} className="w-100">
            </div>
        </div>
    );
}
