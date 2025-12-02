import React, {useContext, useEffect, useState} from "react";

import {SignIntersection, Signpost, SignpostSplit} from "react-bootstrap-icons";

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
                <Signpost className="tooltipIcon" />
                <SignpostSplit className="tooltipIcon" />
                <SignIntersection className="tooltipIcon" />
            </div>
        </div>
    );
}
