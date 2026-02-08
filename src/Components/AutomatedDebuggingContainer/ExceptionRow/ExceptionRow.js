import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {Bug} from "react-bootstrap-icons";

import StackContext from "../../../Providers/StackContext";

import "./ExceptionRow.scss";

ExceptionRow.propTypes = {
    violation: PropTypes.object,
};

/**
 * Component which renders the exception row.
 * @return {JSX.Element}
 */
export function ExceptionRow ({violation}) {
    const [description, setDescription] = useState();

    useEffect(() => {
        if (violation) {
            if (!violation.sentence) {
                setDescription(`No description for violation was provided.`);
            } else {
                setDescription(violation.sentence);
            }
        }
    }, [violation]);

    return (
        <div className="semantic-violation-row">
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
