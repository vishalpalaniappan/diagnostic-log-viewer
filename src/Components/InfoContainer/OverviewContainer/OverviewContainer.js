import React, {useContext, useEffect, useRef, useState} from "react";

import HeaderMetadataContext from "../../../Providers/HeaderMetadataContext";

import "./OverviewContainer.scss";

/**
 * @return {JSX.Element}
 */
export function OverviewContainer ({}) {
    const overviewContainer = useRef();
    const headerMetaContext = useContext(HeaderMetadataContext);

    const [overview, setOverview] = useState(<></>);

    useEffect(() => {
        const stats = headerMetaContext?.headerMetadata?.stats || {};
        const rows = [];
        for (const key in stats) {
            if (key) {
                const stat = stats[key];
                const row = <div key={key} className="rowInfo">
                    <span className="rowName">{stat.name}</span>
                    <span className="rowValue">{stat.value}</span>
                </div>;
                rows.push(row);
            }
        }
        setOverview(rows);
    }, [headerMetaContext]);

    return (
        <div ref={overviewContainer} className="w-100 h-100 info-container">
            {overview}
        </div>
    );
}
