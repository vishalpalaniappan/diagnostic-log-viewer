import React, {useContext, useEffect, useRef,useState} from "react";

import ReactJsonView from "@microlink/react-json-view";

import HeaderMetadataContext from "../../../Providers/HeaderMetadataContext";

import "./LogTypeMapContainer.scss";

/**
 * @return {JSX.Element}
 */
export function LogTypeMapContainer ({}) {
    const logtypeMapContainer = useRef();

    const [ltMap, setLtMap] = useState({});

    const headerMetaContext = useContext(HeaderMetadataContext);

    const logTypeStackTheme = {
        base00: "#252526",
        base01: "#ddd",
        base02: "#474747",
        base03: "#444",
        base04: "#717171",
        base05: "#444",
        base06: "#444",
        base07: "#c586c0", // keys
        base08: "#444",
        base09: "#ce9178", // String
        base0A: "rgba(70, 70, 230, 1)",
        base0B: "#ce9178",
        base0C: "rgba(70, 70, 230, 1)",
        base0D: "#bbb18c", // indent arrow
        base0E: "#bbb18c", // indent arrow
        base0F: "#a7ce8a",
    };


    useEffect(() => {
        const ltMap = headerMetaContext?.headerMetadata?.logTypeMap || {};
        setLtMap(ltMap);
    }, [headerMetaContext]);

    return (
        <div ref={logtypeMapContainer} className="w-100 h-100 logtype-map-container">
            <ReactJsonView
                src={ltMap}
                theme={logTypeStackTheme}
                collapsed={1}
                name={"Log Type Map"}
                groupArraysAfterLength={100}
                sortKeys={true}
                displayDataTypes={false}
                quotesOnKeys={true}
                collapseStringsAfterLength={30}>
            </ReactJsonView>
        </div>
    );
}
