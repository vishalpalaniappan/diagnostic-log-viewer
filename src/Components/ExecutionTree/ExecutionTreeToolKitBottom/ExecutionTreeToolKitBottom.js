import React, {useContext, useEffect, useState} from "react";

import {SignIntersection, Signpost, SignpostSplit} from "react-bootstrap-icons";

import "./ExecutionTreeToolKitBottom.scss";

ExecutionTreeToolKitBottom.propTypes = {
};

/**
 * Contains the execution toolkit below the execution tree.
 * @return {JSX.Element}
 */
export function ExecutionTreeToolKitBottom ({}) {
    return (
        <div className="bottomMenuContainer">
            <div className="leftContent">
                <span>Level:</span>
                <select>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
                <button>Collapse Level</button>
            </div>
            <div className="rightContent">
                <Signpost className="tooltipIcon" />
                <SignpostSplit className="tooltipIcon" />
                <SignIntersection className="tooltipIcon" />
            </div>
        </div>
    );
}
