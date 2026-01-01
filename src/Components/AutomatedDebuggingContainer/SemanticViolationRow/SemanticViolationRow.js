import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Bug} from "react-bootstrap-icons";

import StackContext from "../../../Providers/StackContext";

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
    const [description, setDescription] = useState();
    const {setActiveAbstraction} = useContext(StackContext);

    useEffect(() => {
        if (violation) {
            if (!violation.description) {
                setDescription(
                    `No description for violation was provided. 
                    The intent description is: ${node.intent}`
                );
            } else {
                setDescription(violation.description);
            }
        }
    }, [violation, node]);

    const goToViolation = (e, node) => {
        setActiveAbstraction({
            node: node,
        });
    };

    return (
        <div className="semantic-violation-row" onClick={(e) => goToViolation(e, node)}>
            <div className="violation-icon">
                <Bug />
            </div>
            <div className="violation-content">
                <div className="violation-content-text">
                    {description}
                </div>
            </div>
        </div>
    );
}
