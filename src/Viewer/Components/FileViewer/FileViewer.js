import React from "react";

import {MonacoInstance} from "../../../Components/MonacoInstance/MonacoInstance";
import {Tabs} from "../../../Components/Tabs/Tabs";

import "./FileViewer.scss";
import "monaco-editor/min/vs/editor/editor.main.css";

/**
 * Contains the monaco editor and file tabs.
 * @return {JSX.Element}
 */
export function FileViewer () {
    return (
        <div className="file-view-container d-flex flex-column">
            <Tabs />
            <div className="editor d-flex flex-grow-1">
                <MonacoInstance/>
            </div>
        </div>
    );
}
