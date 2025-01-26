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
            const tabsJSX = Object.keys(fileTree).map((filePath, index) => {
                const fileName = filePath.split("/").pop();
                return <Tab key={index} filePath={filePath} fileName={fileName}></Tab>;
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
