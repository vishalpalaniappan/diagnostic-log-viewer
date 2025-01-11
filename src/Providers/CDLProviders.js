import React from "react";

import PropTypes from "prop-types";

CDLProviders.propTypes = {
    children: PropTypes.object,
};

/**
 * Provides all contexts consumed by the application.
 * @param {JSX} children
 * @return {JSX}
 */
function CDLProviders ({children}) {
    return (
        <>
            {children}
        </>
    );
};

export default CDLProviders;
