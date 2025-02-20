import React, {useEffect, useRef, useContext} from "react";

import "./FileContainer.scss";

/**
 * @return {JSX.Element}
 */
export function FileContainer ({}) {
    const settingsContainer = useRef();
    const filesContainer = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = settingsContainer.current.clientHeight;
        filesContainer.current.style.height = height - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={settingsContainer} className="w-100 h-100 settings-container">
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>
                Files
            </div>
            <div ref={filesContainer} className="w-100">
            </div>
        </div>
    );
}
