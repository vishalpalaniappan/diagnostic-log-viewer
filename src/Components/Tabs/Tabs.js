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

    const getFrequencyOfItem = (arr, item) => {
        return arr.filter((x) => x === item).length;
    };

    useEffect(() => {
        if (fileTree) {
            const fileNames = Object.keys(fileTree).map((path, index) => {
                return path.split("/").pop();
            });
            // If fileName occurs more than once, then use filepath as tabName.
            const tabsJSX = Object.keys(fileTree).map((filePath, index) => {
                const count = getFrequencyOfItem(fileNames, fileNames[index]);
                const tabName = count === 1
                    ? fileNames[index]
                    : filePath;
                return <Tab key={filePath} filePath={filePath} tabName={tabName}></Tab>;
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
