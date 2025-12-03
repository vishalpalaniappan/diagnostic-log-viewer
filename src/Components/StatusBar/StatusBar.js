import React, {useContext, useEffect, useRef, useState} from "react";

import {Diagram2Fill} from "react-bootstrap-icons";

import ActionsContext from "../../Providers/ActionsContext";
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
    const {actions} = useContext(ActionsContext);

    const statusRef = useRef();

    const [statusMessage, setStatusMessage] = useState();

    const STATUS_MESSAGE_TIMEOUT = 2000;

    useEffect(() => {
        if (actions?.value) {
            setStatusMessage(actions.value);
            const timerId = setTimeout(() => {
                setStatusMessage("");
            }, STATUS_MESSAGE_TIMEOUT);

            return () => {
                clearTimeout(timerId);
            };
        }
    }, [actions]);

    return (
        <div id="status-bar">
            <div className="status-bar">
                <div className="status-left">
                    <span className="statusMessage" ref={statusRef}>
                        {statusMessage}
                    </span>
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
