import React, {useEffect, useRef} from "react";

import "./SettingsContainer.scss";

/**
 * @return {JSX.Element}
 */
export function SettingsContainer ({}) {
    const settingsContainer = useRef();
    const uiOptions = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = settingsContainer.current.clientHeight;
        uiOptions.current.style.height = height - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={settingsContainer} className="w-100 h-100 settings-container">
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>
                Settings
            </div>
            <div ref={uiOptions} className="w-100">
            </div>
        </div>
    );
}
