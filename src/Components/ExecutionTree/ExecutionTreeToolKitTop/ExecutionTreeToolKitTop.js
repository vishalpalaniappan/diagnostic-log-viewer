import React, {useContext, useEffect, useState} from "react";

import {SignIntersection, Signpost, SignpostSplit, XCircle} from "react-bootstrap-icons";

import "./ExecutionTreeToolKitTop.scss";

ExecutionTreeToolKitTop.propTypes = {
};

/**
 * Contains the execution toolkit above the execution tree.
 * @return {JSX.Element}
 */
export function ExecutionTreeToolKitTop ({}) {
    return (
        <div className="topMenuContainer">
            <div className="leftContent">
                <span>Execution Tree</span>
            </div>
            <div className="rightContent">
                <div className="tooltipIcon">
                    <Signpost title="Isolate Path to Current Position"
                        className="tooltipIcon" />
                </div>
                <div className="tooltipIcon">
                    <SignpostSplit title="Collapse all levels above current level"
                        className="tooltipIcon" />
                </div>
                <div className="tooltipIcon">
                    <XCircle title="Clear Break Points"
                        className="toolTipIcon" />
                </div>
            </div>
        </div>
    );
}
