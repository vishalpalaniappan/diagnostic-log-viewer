import React, {useContext, useEffect, useRef} from "react";

import PropTypes from "prop-types";
import {FiletypePy} from "react-bootstrap-icons";

import ActiveFileContext from "../../../Providers/ActiveFileContext";
import StackContext from "../../../Providers/StackContext";
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
    const {activeFile, setActiveFile} = useContext(ActiveFileContext);
    const {stack} = useContext(StackContext);
    const {stackPosition} = useContext(StackPositionContext);

    const renderTab = () => {
        if (activeFile) {
            if (activeFile === fileName) {
                tabRef.current.classList.add("activeTab");
            } else {
                tabRef.current.classList.remove("activeTab");
            }
        }
        if (stackPosition != undefined) {
            if (stack[stackPosition].fileName === fileName) {
                tabRef.current.classList.add("stackTab");
            } else {
                tabRef.current.classList.remove("stackTab");
            }
        }
    };

    useEffect(() => {
        renderTab();
    }, [activeFile, stackPosition]);

    const selectFile = (e) => {
        setActiveFile(fileName);
    };

    return (
        <div ref={tabRef} className="tab d-flex align-items-center" onClick={selectFile}>
            <FiletypePy className="icon"/> {fileName}
        </div>
    );
}
