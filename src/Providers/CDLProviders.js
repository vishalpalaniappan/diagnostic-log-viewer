import React, {useEffect, useState} from "react";

import PropTypes from "prop-types";

import AppStateContext from "./AppStateContext";

CDLProviders.propTypes = {
    children: PropTypes.object,
    filePath: PropTypes.string,
};

/**
 * Provides all contexts consumed by the application.
 * @param {JSX} children
 * @param {string} filePath
 * @return {JSX}
 */
function CDLProviders ({children, filePath}) {
    const [appState, setAppState] = useState();

    useEffect(() => {
        if (filePath) {
            console.info("File Path:", filePath);
        }
    }, [filePath]);

    return (
        <AppStateContext.Provider value={{appState, setAppState}}>
            {children}
        </AppStateContext.Provider>
    );
};

export default CDLProviders;
