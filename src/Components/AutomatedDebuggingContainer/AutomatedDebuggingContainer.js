import React, {useEffect, useRef} from "react";

import "./AutomatedDebuggingContainer.scss";

/**
 * Container for automated debugging information.
 * @return {JSX.Element}
 */
export function AutomatedDebuggingContainer ({}) {
    const automatedDebuggingContainer = useRef();
    const debugInfo = useRef();

    return (
        <div className="w-100 h-100 automated-debugging-container">
        </div>
    );
}
