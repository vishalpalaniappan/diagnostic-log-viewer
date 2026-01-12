import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Bug} from "react-bootstrap-icons";

import BehaviorContext from "../../../Providers/BehaviorContext";

import "./SemanticViolationRowBehavioral.scss";

SemanticViolationRowBehavioral.propTypes = {
    node: PropTypes.object,
    violationIndex: PropTypes.number,
    violation: PropTypes.object,
};

/**
 * Component which renders the semantic violation row for the behavioral UI.
 * @return {JSX.Element}
 */
export function SemanticViolationRowBehavioral ({node, violationIndex, violation}) {
    const [description, setDescription] = useState();
    const {setActiveBehavior} = useContext(BehaviorContext);

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
        setActiveBehavior(node.index);
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
