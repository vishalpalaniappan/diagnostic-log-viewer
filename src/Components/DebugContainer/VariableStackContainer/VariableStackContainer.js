import React, {useContext} from "react";

import ReactJsonView from "@microlink/react-json-view";

import VariablesContext from "../../../Providers/VariablesContext";
import GlobalVariablesContext from "../../../Providers/GlobalVariablesContext";

import "./VariableStackContainer.scss";

/**
 * Contains the variable stack container.
 * @return {JSX.Element}
 */
export function VariableStackContainer () {
    const {localVariables} = useContext(VariablesContext);
    const {globalVariables} = useContext(GlobalVariablesContext);

    const variableStackTheme = {
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

    return (
        <div className="variableStackContainer w-100 h-100 ">
            <ReactJsonView
                src={localVariables}
                theme={variableStackTheme}
                collapsed={1}
                name={"local"}
                groupArraysAfterLength={100}
                sortKeys={true}
                displayDataTypes={false}
                quotesOnKeys={true}
                collapseStringsAfterLength={30}>
            </ReactJsonView>
            <ReactJsonView
                src={globalVariables}
                theme={variableStackTheme}
                collapsed={1}
                name={"global"}
                groupArraysAfterLength={100}
                sortKeys={true}
                displayDataTypes={false}
                quotesOnKeys={true}
                collapseStringsAfterLength={30}>
            </ReactJsonView>
        </div>
    );
}
