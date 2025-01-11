import React, {useEffect, useState} from "react";

import CDLProviders from "./Providers/CDLProviders";
import {Viewer} from "./Viewer/Viewer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

/**
 * Renders the application.
 *
 * @return {JSX.Element}
 */
export function App () {
    const [fileInfo, setFileInfo] = useState();

    useEffect( () => {
        const urlParams = new URLSearchParams(window.location.search);
        const fileUrl = urlParams.get("filePath");
        setFileInfo(fileUrl);
    }, []);

    return (
        <CDLProviders fileInfo={fileInfo}>
            <Viewer />
        </CDLProviders>
    );
}
