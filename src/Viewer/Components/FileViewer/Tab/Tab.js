import React, {useContext, useEffect, useRef} from "react";

import PropTypes from "prop-types";
import {FiletypePy} from "react-bootstrap-icons";

import AppStateContext from "../../../../Providers/AppStateContext";

import "./Tab.scss";

Tab.propTypes = {
    fileName: PropTypes.string,
};

/**
 * Contains the monaco editor.
 * @return {JSX.Element}
 */
export function Tab ({fileName}) {
    const tabRef = useRef();
    const {appState, setAppState} = useContext(AppStateContext);

    useEffect(() => {
        if (appState) {
            if (appState.activeFile === fileName) {
                tabRef.current.classList.add("activeTab");
            } else {
                tabRef.current.classList.remove("activeTab");
            }
        }
    }, [appState]);

    const selectFile = (e) => {
        setAppState({
            "activeFile": fileName,
        });
    };

    return (
        <div ref={tabRef} className="tab d-flex align-items-center" onClick={selectFile}>
            <FiletypePy className="icon"/> {fileName}
        </div>
    );
}
