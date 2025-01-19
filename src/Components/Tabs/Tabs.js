import React, {useContext, useEffect, useState} from "react";

import FileTreeContext from "../../Providers/FileTreeContext";
import {Tab} from "./Tab/Tab";

import "./Tabs.scss";

/**
 * Renders the tabs.
 * @return {JSX.Element}
 */
export function Tabs ({}) {
    const {fileTree} = useContext(FileTreeContext);

    const [tabs, setTabs] = useState();

    useEffect(() => {
        if (fileTree) {
            const files = Object.keys(fileTree);
            const tabsJSX = files.map((file, index) => {
                return <Tab key={index} fileName={file}></Tab>;
            });
            setTabs(tabsJSX);
        }
    }, [fileTree]);

    // TODO: Reimplement scroll bar for tabs.
    return (
        <div className="tabs d-flex">
            {tabs}
        </div>
    );
}
