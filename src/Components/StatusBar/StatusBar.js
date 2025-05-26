import React, {useContext, useEffect, useState} from "react";

import {Diagram2Fill} from "react-bootstrap-icons";

import {StatusBarMenu} from "./StatusBarMenu/StatusBarMenu";

import "./StatusBar.scss";

StatusBar.propTypes = {
};

/**
 * Status bar of the viewer component.
 * @return {JSX.Element}
 */
export function StatusBar ({}) {
    return (
        <div id="status-bar">
            <div className="status-bar">
                <div className="status-left">
                </div>
                <div className="status-right ">
                    <StatusBarMenu className="status-item status-item-button status-verbosity-accent">
                        <Diagram2Fill/><span className="ms-2 me-3">Main Thread</span>
                    </StatusBarMenu>
                </div>
            </div>
        </div>
    );
}
