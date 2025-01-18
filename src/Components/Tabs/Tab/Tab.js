import React, {useContext, useEffect, useRef} from "react";

import PropTypes from "prop-types";
import {FiletypePy} from "react-bootstrap-icons";

import StackPositionContext from "../../../Providers/StackPositionContext";

import "./Tab.scss";

Tab.propTypes = {
    fileName: PropTypes.string,
};

/**
 * Tab Component.
 * @return {JSX.Element}
 */
export function Tab ({fileName}) {
    const tabRef = useRef();
    const {stackPosition} = useContext(StackPositionContext);

    useEffect(() => {
        if (stackPosition) {
            if (stackPosition.activeFile === fileName) {
                tabRef.current.classList.add("activeTab");
            } else {
                tabRef.current.classList.remove("activeTab");
            }
        }
    }, [stackPosition]);

    const selectFile = (e) => {
        const updatedState = Object.assign({}, positionState);
        updatedState["activeFile"] = fileName;
        setPositionState(updatedState);
    };

    return (
        <div ref={tabRef} className="tab d-flex align-items-center" onClick={selectFile}>
            <FiletypePy className="icon"/> {fileName}
        </div>
    );
}
