import React, {useContext, useEffect, useRef, useState} from "react";

import {Bug} from "react-bootstrap-icons";

import "./SemanticViolationRow.scss";

/**
 * Component which renders the semantic violation row.
 * @return {JSX.Element}
 */
export function SemanticViolationRow ({}) {
    return (
        <div className="w-100 h-100 automated-debugging-container">
            <div className="semantic-violation-row">
                <div className="violation-icon">
                    <Bug />
                </div>
                <div className="violation-content">
                    <div className="violation-content-text">
                        The semantic contract that only books with\
                        a name can be accepted was violated.
                    </div>
                </div>
            </div>
        </div>
    );
}
