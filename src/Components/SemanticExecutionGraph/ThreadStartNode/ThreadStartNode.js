import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {CaretDownFill, CaretRightFill} from "react-bootstrap-icons";

import SEGInstanceContext from "../SEGInstanceContext";

import "./ThreadStartNode.scss";

ThreadStartNode.propTypes = {
    node: PropTypes.object,
};

/**
 * Contains a node that is the start of a thread.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function ThreadStartNode ({node}) {
    const {toggleCollapse} = useContext(SEGInstanceContext);
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

    return (
        <div id={"start-" + node.threadId} className="threadStartRow">
            <div className="icon-container">
            </div>

            <div className="flex-grow-1 d-flex flex-row w-100"
                onClick={(e) => clickToggle(e, node)}>

                <div className="collapse-icon-container">
                    {getCollapsed(node)}
                </div>

                <div className="text-container flex-grow-1">
                    <span>Thread ID: {node.threadId}</span>
                </div>
            </div>
        </div>
    );
}
