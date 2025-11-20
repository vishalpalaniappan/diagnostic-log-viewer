import React, {useContext, useEffect} from "react";

import ReactJsonView from "@microlink/react-json-view";

import StackContext from "../../../Providers/StackContext";

import "./AbstractionInfoContainer.scss";

/**
 * Contains the abstraction info container.
 * @return {JSX.Element}
 */
export function AbstractionInfoContainer () {
    const {stacks} = useContext(StackContext);
    const [abstractionInfo, setAbstractionInfo] = React.useState();

    useEffect(() => {
        if (stacks) {
            for (const threadId of Object.keys(stacks)) {
                if (stacks[threadId].main) {
                    const stack = stacks[threadId].stack;

                    if ("abstraction_meta" in stack.currLtInfo) {
                        setAbstractionInfo(stack.currLtInfo.abstraction_meta.value);
                    } else {
                        setAbstractionInfo(stack.currLtInfo);
                    }
                    
                    break;
                }
            };
        }
    }, [stacks]);

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
        <div className="abstractionInfoContainer w-100 h-100 ">
            <ReactJsonView
                src={abstractionInfo}
                theme={variableStackTheme}
                collapsed={4}
                name={"Current Abstraction"}
                groupArraysAfterLength={100}
                sortKeys={true}
                displayDataTypes={false}
                quotesOnKeys={false}
                collapseStringsAfterLength={30}>
            </ReactJsonView>
        </div>
    );
}
