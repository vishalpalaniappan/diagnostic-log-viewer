import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {CaretDown, CaretRight} from "react-bootstrap-icons";

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

    useEffect(() => {
        if (node) {
            const padLeft = ((node.level - 1) * 20) + "px";
            setPaddingLeft(padLeft);
        }
    }, [node]);

    const clicked = (e) => {
        node.collapsed = !node.collapsed;
    };

    const getCollapsed = (node) => {
        if (!node.collapsible) {
            return <></>;
        }
        console.log("collapsing");
        if (node.collapsed) {
            return <CaretDown class="icon"/>;
        } else {
            return <CaretRight class="icon"/>;
        }
    };

    return (
        <>
            <div className="abstractionRow d-flex flex-row w-100 ">
                <div style={{paddingLeft: paddingLeft}}>
                    {
                        getCollapsed(node)
                    }
                    {node.intent}
                </div>
            </div>
        </>
    );
}
