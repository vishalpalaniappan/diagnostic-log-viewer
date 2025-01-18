import React from "react";

import TreeView, {flattenTree} from "react-accessible-treeview";
import {App, Box} from "react-bootstrap-icons";

import "./TreeContainer.scss";

/**
 * @return {JSX.Element}
 */
export function TreeContainer ({}) {
    const folder = {
        name: "",
        children: [
            {
                name: "src",
                children: [{name: "index.js"}, {name: "styles.css"}],
            },
            {
                name: "node_modules",
                children: [
                    {
                        name: "react-accessible-treeview",
                        children: [{name: "index.js"}],
                    },
                    {name: "react", children: [{name: "index.js"}]},
                ],
            },
            {
                name: ".npmignore",
            },
            {
                name: "package.json",
            },
            {
                name: "webpack.config.js",
            },
        ],
    };
    const data = flattenTree(folder);

    return (
        <div className="w-100 h-100 tree-container">
            <TreeView
                data={data}
                aria-label="directory tree"
                nodeRenderer={({
                    element,
                    isBranch,
                    isExpanded,
                    getNodeProps,
                    level,
                }) => (
                    <div {...getNodeProps()} style={{paddingLeft: 20 * (level - 1)}}>
                        {isBranch ? (
                            <App isOpen={isExpanded} />
                        ) : (
                            <Box className="tree-icon icon-leaf" filename={element.name} />
                        )}
                        <span className="tree-text">{element.name}</span>
                    </div>
                )}
            />
        </div>
    );
}
