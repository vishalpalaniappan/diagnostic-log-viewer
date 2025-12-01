import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {CaretDown, CaretRight} from "react-bootstrap-icons";

import ExecutionTreeContext from "../ExecutionTreeContext";

import "./AbstractionRow.scss";

AbstractionRow.propTypes = {
    node: PropTypes.object,
};

/**
 * Contains the abstraction row.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function AbstractionRow ({node}) {
    const {executionArray, toggleCollapse} = useContext(ExecutionTreeContext);

    const clickToggle = (e, node) => {
        e.preventDefault();
        if (node.collapsible) {
            toggleCollapse(node);
        }
    };

    const getCollapsed = (node) => {
        if (!node.collapsible) {
            return <></>;
        }
        if (node.collapsed) {
            return <CaretRight className="icon"/>;
        } else {
            return <CaretDown className="icon"/>;
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
            <div className="abstractionRow d-flex flex-row w-100">
                <div className="spacer-container d-flex">
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
