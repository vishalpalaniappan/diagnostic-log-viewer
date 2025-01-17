import React, {useContext, useEffect, useState} from "react";

import FileTreeContext from "../../../../Providers/FileTreeContext";
import {Tab} from "./Tab/Tab";

import "./Tabs.scss";

/**
 * Contains the tabs.
 * @return {JSX.Element}
 */
export function Tabs ({}) {
    const {fileTree} = useContext(FileTreeContext);

    const [tabs, setTabs] = useState();
    const [files, setFiles] = useState();

    useEffect(() => {
        if (fileTree) {
            setFiles(Object.keys(fileTree));
        }
    }, [fileTree]);

    useEffect(() => {
        if (files) {
            const tabsJSX = files.map((file, index) => {
                console.log(file);
                return <Tab key={index} fileName={file}></Tab>;
            });
            setTabs(tabsJSX);
        }
    }, [files]);

    // TODO: Reimplement scroll bar for tabs.
    return (
        <div className="tabs d-flex">
            {tabs}
        </div>
    );
}
