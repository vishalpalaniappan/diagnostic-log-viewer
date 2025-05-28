import React, {useContext, useEffect, useState} from "react";

import {Diagram2Fill} from "react-bootstrap-icons";

import ThreadsContext from "../../Providers/ThreadsContext";
import {StatusBarMenu} from "./StatusBarMenu/StatusBarMenu";

import "./StatusBar.scss";

StatusBar.propTypes = {
};

/**
 * Status bar of the viewer component.
 * @return {JSX.Element}
 */
export function StatusBar ({}) {
    const {threads} = useContext(ThreadsContext);

    return (
        <div id="status-bar">
            <div className="status-bar">
                <div className="status-left">
                </div>
                <div className="status-right ">
                    {threads &&
                        <StatusBarMenu
                            className="status-item status-item-button status-thread-accent">
                            <Diagram2Fill/>
                            <span className="ms-2 me-3">
                                Current Thread: {threads[0]}
                            </span>
                        </StatusBarMenu>
                    }
                </div>
            </div>
        </div>
    );
}
