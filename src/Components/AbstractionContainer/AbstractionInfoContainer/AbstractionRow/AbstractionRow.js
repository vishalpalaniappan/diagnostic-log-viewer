import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";

import "./AbstractionRow.scss";

AbstractionRow.propTypes = {
    node: PropTypes.Object
};

/**
 * Contains the abstraction row.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function AbstractionRow ({node}) {
    const [paddingLeft, setPaddingLeft] = useState();

    useEffect(() => {
        if (node) {
            const padLeft = (node.level * 20) + "px";
            setPaddingLeft(padLeft);
        }
    }, [node]);

    return (
        <div
            style={{paddingLeft: paddingLeft}}
            className="abstractionRow w-100 ">
            {node.intent}
        </div>
    );
}
