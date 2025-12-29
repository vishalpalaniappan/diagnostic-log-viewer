import React, {useContext, useEffect, useRef, useState} from "react";

import {Eyeglasses} from "react-bootstrap-icons";

import PROGRAM_STATE from "../../PROGRAM_STATE";
import ActionsContext from "../../Providers/ActionsContext";
import StackContext from "../../Providers/StackContext";
import {StatusBarMenu} from "./StatusBarMenu/StatusBarMenu";

import "./StatusBar.scss";

StatusBar.propTypes = {
};

/**
 * Status bar of the viewer component.
 * @return {JSX.Element}
 */
export function StatusBar ({}) {
    const {activeThread} = useContext(StackContext);
    const {mode, actions} = useContext(ActionsContext);

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

    const getProgramMode = () => {
        if (mode === PROGRAM_STATE.STACK) {
            return "Program Mode: Stack Based Debugging";
        } else if (mode === PROGRAM_STATE.SEG) {
            return "Program Mode: SEG Based Debugging";
        }
    };

    return (
        <div id="status-bar">
            <div className="status-bar">
                <div className="status-left">
                    <span className="statusMessage" ref={statusRef}>
                        {statusMessage}
                    </span>
                </div>
                <div className="status-right ">

                    <StatusBarMenu
                        className="status-item status-item-button status-verbosity-accent"
                        disabled={false}
                    >
                        <Eyeglasses/>
                        <span className="ms-2 me-2">{getProgramMode()}</span>
                    </StatusBarMenu>
                </div>
            </div>
        </div>
    );
}
