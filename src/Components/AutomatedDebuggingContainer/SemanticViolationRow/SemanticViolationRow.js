import React, {useContext, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";
import {Bug} from "react-bootstrap-icons";

import "./SemanticViolationRow.scss";

SemanticViolationRow.propTypes = {
    node: PropTypes.object,
    violationIndex: PropTypes.number,
    violation: PropTypes.object,
};

/**
 * Component which renders the semantic violation row.
 * @return {JSX.Element}
 */
export function SemanticViolationRow ({node, violationIndex, violation}) {
    useEffect(() => {
        if (violation) {
            console.log(violation);
        }
    }, [violation]);
    return (
        <div className="semantic-violation-row">
            <div className="violation-icon">
                <Bug />
            </div>
            <div className="violation-content">
                <div className="violation-content-text">
                    {node.intent}
                </div>
            </div>
        </div>
    );
}
