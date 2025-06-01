import React, {useContext} from "react";

import {Diagram2Fill} from "react-bootstrap-icons";

import StackContext from "../../Providers/StackContext";

import "./StatusBar.scss";

StatusBar.propTypes = {
};

/**
 * Status bar of the viewer component.
 * @return {JSX.Element}
 */
export function StatusBar ({}) {
    const {activeThread} = useContext(StackContext);

    return (
        <div id="status-bar">
            <div className="status-bar">
                <div className="status-left">
                </div>
                <div className="status-right ">
                    {activeThread &&
                        <div className="status-item status-item-button status-thread-accent">
                            <Diagram2Fill/>
                            <span className="ms-2 me-1">
                                Current Thread: {activeThread}
                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
