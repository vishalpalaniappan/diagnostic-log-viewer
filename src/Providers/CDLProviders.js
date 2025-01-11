import React, {useEffect} from "react";

import PropTypes from "prop-types";

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
    useEffect(() => {
        if (filePath) {
            console.info("File Path:", filePath);
        }
    }, [filePath]);

    return (
        <>
            {children}
        </>
    );
};

export default CDLProviders;
