import React, {useContext, useEffect, useState} from "react";

import {ArrowDownShort, ArrowLeftShort, ArrowRepeat, ArrowRightShort,
    ArrowUpShort, Play} from "react-bootstrap-icons";

import "./ExecutionTreeToolKitTop.scss";

ExecutionTreeToolKitTop.propTypes = {
};

/**
 * Contains the execution toolkit above the execution tree.
 * @return {JSX.Element}
 */
export function ExecutionTreeToolKitTop ({}) {
    
    const blueColor = "#75beff";
    const greyColor = "#7c7c7c";
    const greenColor = "#00BB00";


    return (
        <div className="topMenuContainer">
            <div className="leftContent">
                <span className="title">
                    ToolKit:
                </span>
                <Play
                    className="me-1 icon"
                    title="Play (Right Bracket Key)"
                    style={{color: blueColor}}
                    size={20} />
                <ArrowLeftShort
                    className="me-1 icon"
                    title="Step Over Backward (← Key)"
                    style={{color: blueColor}}
                    size={20} />
                <ArrowRightShort
                    className="me-1 icon"
                    title="Step Over Forward (→ Key)"
                    style={{color: blueColor}}
                    size={20} />
                <ArrowUpShort
                    className="me-1 icon"
                    title="Step Out (↑ Key)"
                    style={{color: blueColor}}
                    size={20} />
                <ArrowDownShort
                    className="me-1 icon"
                    title="Step Into (↓ Key)"
                    style={{color: blueColor}}
                    size={20} />
                <ArrowRepeat
                    className="me-1 icon"
                    title="Restart (R Key)"
                    style={{color: greenColor}}
                    size={20} />
            </div>
            <div className="rightContent"></div>
        </div>
    );
}
