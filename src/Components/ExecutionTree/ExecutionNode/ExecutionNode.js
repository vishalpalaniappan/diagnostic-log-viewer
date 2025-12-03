import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {CaretDownFill, CaretRightFill, SignpostFill, Stack} from "react-bootstrap-icons";

import ExecutionTreeInstanceContext from "../ExecutionTreeInstanceContext";

import "./ExecutionNode.scss";

AbstractionRow.propTypes = {
    node: PropTypes.object,
};

/**
 * Contains a node in the execution tree.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function AbstractionRow ({node}) {
    const {selectedNode, selectNode, toggleCollapse} = useContext(ExecutionTreeInstanceContext);
    const [selectedStyle, setSelectedStyle] = useState();

    // Set style if node is selected.
    useEffect(() => {
        if (node && selectedNode) {
            if (selectedNode === node) {
                setSelectedStyle({background: "#3b3b3b", color: "white"});
            } else {
                setSelectedStyle({});
            }
        }
    }, [selectedNode, node]);

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
        selectNode(node);
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
        for (let i = 0; i < node.level - 1; i++) {
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
        if (node.abstractionType === "function_call") {
            return <Stack className="icon"
                title="Function Call"
                style={{color: "orange"}}/>;
        } else if (node.abstractionType === "conditional_branch") {
            return <SignpostFill
                className="icon"
                title="Conditional Branch"
                style={{color: "#3794ff"}}/>;
        }
    };

    return (
        <div style={selectedStyle} id={"row" + node.index}
            className="abstractionRow d-flex flex-row w-100">

            <div className="flex-grow-1 d-flex flex-row w-100"
                onClick={(e) => clickSelectNode(e, node)}>

                <div className="d-flex flex-row">
                    {getSpacers(node)}
                </div>

                <div onClick={(e) => clickToggle(e, node)} className="collapse-icon-container">
                    {getCollapsed(node)}
                </div>

                <div className="text-container flex-grow-1">
                    {node.intent}
                </div>

            </div>

            <div className="icon-container">
                {getNodeIconType()}
            </div>

        </div>
    );
}
