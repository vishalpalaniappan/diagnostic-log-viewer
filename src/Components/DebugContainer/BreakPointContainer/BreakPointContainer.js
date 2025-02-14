import React, {useContext, useEffect, useState} from "react";

import BreakpointsContext from "../../../Providers/BreakpointsContext";
import {BreakPointRow} from "./BreakPointRow/BreakPointRow";

import "./BreakPointContainer.scss";

/**
 * Contains the breakpoint container.
 * @return {JSX.Element}
 */
export function BreakPointContainer () {
    const [breakPointStack, setBreakPointStack] = useState();

    const {breakPoints} = useContext(BreakpointsContext);

    useEffect(() => {
        if (breakPoints) {
            const _breakPoints = [];
            breakPoints.forEach((breakPoint, index) => {
                const row = <BreakPointRow
                    key={index}
                    index={index}
                    filePath={breakPoint.filePath}
                    fileName={breakPoint.fileName}
                    lineNumber={breakPoint.lineno}
                    enabled={breakPoint.enabled}
                />;
                _breakPoints.push(row);
            });
            setBreakPointStack(_breakPoints);
        } else {
            setBreakPointStack([]);
        }
    }, [breakPoints]);

    return (
        <div className="breakPointContainer">
            {breakPointStack}
        </div>
    );
}
