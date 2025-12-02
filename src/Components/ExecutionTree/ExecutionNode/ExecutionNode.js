import React, {useContext, useEffect, useLayoutEffect, useState} from "react";

import PropTypes from "prop-types";
import {CaretDownFill, CaretRightFill, Stack} from "react-bootstrap-icons";

import WorkerContext from "../../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../../Services/CDL_WORKER_PROTOCOL";
import ExecutionTreeInstanceContext from "../ExecutionTreeInstanceContext";

import "./ExecutionNode.scss";

AbstractionRow.propTypes = {
    node: PropTypes.object,
    breakpoint: PropTypes.object,
};

/**
 * Contains the abstraction row.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function AbstractionRow ({node, breakpoint}) {
    const {selectedNode, selectNode, toggleCollapse} = useContext(ExecutionTreeInstanceContext);
    const {cdlWorker} = useContext(WorkerContext);

    const [breakPointStyle, setBreakPointStyle] = useState();
    const [selectedStyle, setSelectedStyle] = useState();

    // Set style if node is selected.
    useEffect(() => {
        if (node && selectedNode) {
            if (selectedNode == node) {
                setSelectedStyle({background: "#3b3b3b", color: "white"});
            } else {
                setSelectedStyle({});
            }
        }
    }, [selectedNode]);

    /**
     * Callback when a node is toggled.
     * @param {Event} e
     * @param {Object} node
     */
    const clickToggle = (e, node) => {
        e.preventDefault();
        if (node.collapsible) {
            toggleCollapse(node);
        }
    };

    // Cycles through the breakpoint states.
    // Enabled -> Disable -> Toggle
    const clickBreakpoint = (e, breakpoint, node) => {
        let code;
        const fileName = node.filePath;
        const lineNumber = node.lineno;
        if (breakpoint && breakpoint.enabled) {
            code = CDL_WORKER_PROTOCOL.TOGGLE_BREAKPOINT_ENABLED;
        } else {
            code = CDL_WORKER_PROTOCOL.TOGGLE_BREAKPOINT;
        }
        cdlWorker.current.postMessage({
            code: code,
            args: {
                fileName: fileName,
                lineNumber: lineNumber,
            },
        });
    };

    /**
     * Call back when a node is selected.
     * @param {Event} e
     * @param {Object} node
     */
    const clickSelectNode = (e, node) => {
        e.preventDefault();
        selectNode(node);
    };

    /**
     * Gets the icon indicating if node can be collapsed
     * or if it is collapsed.
     * @param {Object} node
     * @return {JSX}
     */
    const getCollapsed = (node) => {
        if (!node.collapsible) {
            return <></>;
        }
        if (node.collapsed) {
            return <CaretRightFill className="icon"/>;
        } else {
            return <CaretDownFill className="icon"/>;
        }
    };

    /**
     * Creates space for each node level.
     * @param {Object} node
     * @return {Array}
     */
    const getSpacers = (node) => {
        const spacers = [];
        for (let i = 0; i < node.level - 1; i++) {
            spacers.push(
                <div className="spacer" key={i}>
                    <div className="vertical-line"></div>
                </div>
            );
        }
        return spacers;
    };

    useEffect(() => {
        if (breakpoint) {
            if (breakpoint.enabled) {
                setBreakPointStyle({background: "#ff6262ff"});
            } else {
                setBreakPointStyle({background: "#7e7e7eff"});
            }
        } else {
            setBreakPointStyle({});
        }
    }, [breakpoint]);


    const getNodeIconType = () => {
        if (node.abstractionType === "function_call") {
            return <Stack className="icon" title="Function Call" style={{color: "orange"}}/>;
        }
    };

    return (
        <div style={selectedStyle} id={"row" + node.index}
            className="abstractionRow d-flex flex-row w-100">

            <div onClick={(e) => clickBreakpoint(e, breakpoint, node)}
                title="Click to toggle breakpoint"
                className="breakpoint-container">
                <div style={breakPointStyle}
                    className="breakpoint"></div>
            </div>

            <div className="flex-grow-1 d-flex flex-row w-100"
                onClick={(e) => clickSelectNode(e, node)}>

                <div className="d-flex flex-row">
                    {getSpacers(node)}
                </div>

                <div onClick={(e) => clickToggle(e, node)} className="collapse-icon-container">
                    {getCollapsed(node)}
                </div>

                <div className="text-container flex-grow-1">
                    {node.intent}
                </div>

            </div>

            <div className="icon-container">
                {getNodeIconType()}
            </div>

        </div>
    );
}
