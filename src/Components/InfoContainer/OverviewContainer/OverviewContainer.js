import React, {useEffect, useRef} from "react";

import "./OverviewContainer.scss";

/**
 * @return {JSX.Element}
 */
export function OverviewContainer ({}) {
    const overviewContainer = useRef();
    const uiOptions = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = overviewContainer.current.clientHeight;
        uiOptions.current.style.height = height - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={overviewContainer} className="w-100 h-100 info-container">
            <div ref={uiOptions} className="w-100">
            </div>
        </div>
    );
}
