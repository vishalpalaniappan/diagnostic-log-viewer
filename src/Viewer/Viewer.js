import React, {useContext} from "react";

import {CentralContainer} from "../Components/CentralContainer/CentralContainer";
import PROGRAM_STATE from "../PROGRAM_STATE";
import ActionsContext from "../Providers/ActionsContext";
import {BehavioralViewer} from "./BehavioralViewer";
import {SEGViewer} from "./SEGViewer";
import {StackViewer} from "./StackViewer";
import {StatusBarContainer} from "./StatusBarContainer/StatusBarContainer";

import "./Viewer.scss";

/**
 * Renders the Diagnostic Log Viewer.
 * @return {JSX.Element}
 */
export function Viewer () {
    const {mode} = useContext(ActionsContext);

    const getViewer = () => {
        if (mode === PROGRAM_STATE.BEHAVIORAL) {
            return <BehavioralViewer />;
        } else if (mode === PROGRAM_STATE.SEG) {
            return <SEGViewer />;
        } else if (mode === PROGRAM_STATE.STACK) {
            return <StackViewer />;
        }
    };

    return (
        <>
            {getViewer()}
        </>
    );
}
