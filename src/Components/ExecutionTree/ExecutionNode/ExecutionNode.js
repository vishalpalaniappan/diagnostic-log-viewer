import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {CaretDownFill, CaretRightFill} from "react-bootstrap-icons";

import ExecutionTreeContext from "../ExecutionTreeContext";

import "./ExecutionNode.scss";
import { redirect } from "react-router-dom";

AbstractionRow.propTypes = {
    node: PropTypes.object,
};

/**
 * Contains the abstraction row.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function AbstractionRow ({node}) {
    const {selectedNode, selectNode, toggleCollapse} = useContext(ExecutionTreeContext);

    const [selectedStyle, setSelectedStyle] = useState();

    useEffect(() => {
        if (node && selectedNode) {
            if (selectedNode == node) {
                setSelectedStyle({background: "#3b3b3b", color: "white"});
            } else {
                setSelectedStyle({});
            }
        }
    }, [selectedNode]);

    const clickToggle = (e, node) => {
        e.preventDefault();
        if (node.collapsible) {
            toggleCollapse(node);
        }
    };

    const clickSelectNode = (e, node) => {
        e.preventDefault();
        selectNode(node);
    };

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

    return (
        <>
            <div className="abstractionRow d-flex flex-row w-100"
                style={selectedStyle}
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
        </>
    );
}
