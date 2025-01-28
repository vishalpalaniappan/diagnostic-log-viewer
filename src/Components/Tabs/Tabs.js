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

    const getFrequency = (arr, item) => {
        return arr.filter((x) => x === item).length;
    };

    useEffect(() => {
        if (fileTree) {
            const filePaths = Object.keys(fileTree);
            const fileNames = filePaths.map((path, index) => {
                return path.split("/").pop();
            });
            const tabsJSX = filePaths.map((filePath, index) => {
                const count = getFrequency(fileNames, fileNames[index]);
                const tabName = (count === 1)?fileNames[index]:filePath;
                return <Tab key={index} filePath={filePath} tabName={tabName}></Tab>;
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
