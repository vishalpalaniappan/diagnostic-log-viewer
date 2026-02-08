import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
// eslint-disable-next-line max-len
import {ArrowReturnRight, Bug, CaretDownFill, CaretRightFill} from "react-bootstrap-icons";

import BehaviorContext from "../../../Providers/BehaviorContext";

import "./DebuggerNodeRootCause.scss";

DebuggerNodeRootCause.propTypes = {
    node: PropTypes.object,
};

/**
 * Contains a node in the behavioral tree.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function DebuggerNodeRootCause ({node}) {
    const {setActiveBehavior} = useContext(BehaviorContext);
    const [selectedStyle, setSelectedStyle] = useState();

    // Set style if node is selected.
    useEffect(() => {
    }, [node]);

    /**
     * Callback when a node is toggled.
     * @param {Event} e
     * @param {Object} node
     */
    const clickToggle = (e, node) => {
        e.preventDefault();
        if (node.collapsible) {
            toggleCollapse(node);
        }
    };

    /**
     * Call back when a node is selected.
     * @param {Event} e
     * @param {Object} node
     */
    const clickSelectNode = (e, node) => {
        e.preventDefault();
        setActiveBehavior(node.activeBehaviorKey);
    };
    /**
     * Gets the icon indicating if node can be collapsed
     * or if it is collapsed.
     * @param {Object} node
     * @return {JSX}
     */
    const getCollapsed = (node) => {
        if (!node.collapsible) {
            return <></>;
        }
        if (node.collapsed) {
            return <CaretRightFill className="icon"/>;
        } else {
            return <CaretDownFill className="icon"/>;
        }
    };

    /**
     * Creates space for each node level.
     * @param {Object} node
     * @return {Array}
     */
    const getSpacers = (node) => {
        const spacers = [];
        for (let i = 0; i < node.level; i++) {
            spacers.push(
                <div className="spacer" key={i}>
                    <div className="vertical-line"></div>
                </div>
            );
        }
        return spacers;
    };

    /**
     * Get the node icon type.
     * @return {JSX}
     */
    const getNodeIconType = () => {
        if (node.violation.violation_type === "exception") {
            return <Bug style={{color: "red"}} />;
        } else if (node.violation.violation_type === "invariant") {
            return <ArrowReturnRight />;
        }
    };


    const getBreakPoint = () => {

    };

    return (
        <>
            <div style={selectedStyle} id={"debugging-row-" + node.uid} className="debuggingRow">

                <div className="icon-container">
                    {getBreakPoint()}
                </div>

                <div className="icon-container">
                    <div className="icon">
                        {getNodeIconType()}
                    </div>
                </div>

                <div className="flex-grow-1 d-flex flex-row w-100"
                    onClick={(e) => clickSelectNode(e, node)}>

                    <div className="d-flex flex-row">
                        {getSpacers(node)}
                    </div>

                    <div onClick={(e) => clickToggle(e, node)} className="collapse-icon-container">
                        {getCollapsed(node)}
                    </div>

                    <div className="text-container flex-grow-1">
                        <span>{node.text}</span>
                    </div>
                </div>
            </div>
            { (node.violation.violation_type === "invariant") &&
                <div style={{width: "100%", height: "15px"}}></div>
            }
        </>
    );
}
