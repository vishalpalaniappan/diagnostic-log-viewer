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
    const [paddingLeft, setPaddingLeft] = useState();
    const {executionArray, toggleCollapse} = useContext(ExecutionTreeContext);

    useEffect(() => {
        if (node) {
            const padLeft = ((node.level - 1) * 20) + "px";
            setPaddingLeft(padLeft);
        }
    }, [node]);

    const clicked = (e) => {
        toggleCollapse(node);
    };

    const getCollapsed = (node) => {
        if (!node.collapsible) {
            return <></>;
        }
        if (node.collapsed) {
            return <CaretDown className="icon"/>;
        } else {
            return <CaretRight className="icon"/>;
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
            <div className="abstractionRow d-flex flex-row w-100 "
            onClick={(e) => clicked(e, node)}>
                <div className="spacer-container d-flex">
                    {getSpacers(node)}
                </div>
                <div className="collapse-icon-container">
                    {getCollapsed(node)}
                </div>
                <div className="text-container flex-grow-1">
                    {node.intent}
                </div>
            </div>
        </>
    );
}
