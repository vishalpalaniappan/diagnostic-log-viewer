import React, {useContext, useEffect, useRef} from "react";

import PropTypes from "prop-types";
import {FiletypePy} from "react-bootstrap-icons";

import ActiveFileContext from "../../../Providers/ActiveFileContext";

import "./Tab.scss";

Tab.propTypes = {
    fileName: PropTypes.string,
};

/**
 * Renders a Tab.
 * @return {JSX.Element}
 */
export function Tab ({fileName}) {
    const tabRef = useRef();
    const {activeFile, setActiveFile} = useContext(ActiveFileContext);

    const renderTab = () => {
        if (activeFile != undefined) {
            if (activeFile === fileName) {
                tabRef.current.classList.add("activeTab");
            } else {
                tabRef.current.classList.remove("activeTab");
            }
        }
    };

    useEffect(() => {
        renderTab();
    }, [activeFile]);

    const selectFile = (e) => {
        setActiveFile(fileName);
    };

    return (
        <div ref={tabRef} className="tab d-flex align-items-center" onClick={selectFile}>
            <FiletypePy className="icon"/> {fileName}
        </div>
    );
}
