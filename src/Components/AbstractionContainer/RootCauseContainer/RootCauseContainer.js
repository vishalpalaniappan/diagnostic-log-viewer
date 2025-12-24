import React, {useContext, useEffect, useRef, useState} from "react";

import ExecutionTreeContext from "../../../Providers/ExecutionTreeContext";

import "./RootCauseContainer.scss";

/**
 * Root cause container.
 * @return {JSX.Element}
 */
export function RootCauseContainer () {
    const {rootCauses} = useContext(ExecutionTreeContext);
    const [rootCauseDivs, setRootCauseDivs] = useState();

    useEffect(() => {
        if (rootCauses) {
            const rootCauseEntrys = [];
            rootCauses.forEach((entry, index) => {
                rootCauseEntrys.push(
                    <div key={index} className="rootcause">{entry}</div>
                );
            });
            setRootCauseDivs(
                <div className="rootCauseContainer">
                    <div className="title">Root Cause(s) of Failure</div>
                    {rootCauseEntrys}
                </div>
            );
        }
    }, [rootCauses]);

    return (
        <div className="rootCauseContainer">
            {rootCauseDivs}
        </div>
    );
}
