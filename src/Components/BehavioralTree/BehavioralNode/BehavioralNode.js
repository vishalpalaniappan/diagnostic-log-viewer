import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {CaretDownFill, CaretRightFill, Stack} from "react-bootstrap-icons";

import BreakpointsContext from "../../../Providers/BreakpointsContext";
import DesignTreeInstanceContext from "../BehavioralTreeInstanceContext";

import "./BehavioralNode.scss";

BehavioralNode.propTypes = {
    node: PropTypes.object,
};

/**
 * Contains a node in the execution tree.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function BehavioralNode ({node}) {
    const {selectedNode, selectNode,
        toggleCollapse, setCollapsed} = useContext(DesignTreeInstanceContext);
    const [selectedStyle, setSelectedStyle] = useState();
    const [hasViolation, setHasViolation] = useState();
    const [debugText, setDebugText] = useState();
    const {breakPoints} = useContext(BreakpointsContext);

    // Set style if node is selected.
    useEffect(() => {
        if (node) {
            for (let i = 0; i < node.execution.length; i++) {
                const exec = node.execution[i];
                if ("violation" in exec) {
                    setHasViolation(true);
                    setDebugText("Root Cause");
                }
            }
        }
        if (node && selectedNode) {
            if (node.exception) {
                setSelectedStyle({background: "#3f191b", color: "white"});
            } else if (selectedNode === node) {
                setSelectedStyle({background: "#003d35", color: "white"});
            } else {
                setSelectedStyle({});
            }
        }
    }, [selectedNode, node]);


    const getBreakPoint = () => {
        if (!breakPoints) return;
        let isEnabled;
        let hasBreakPoint;
        for (let k = 0; k < node.execution.length; k++) {
            const entry = node.execution[k];
            for (let i = 0; i < breakPoints.length; i++) {
                const point = breakPoints[i];
                if (point.abstraction_meta === entry.abstractionId) {
                    hasBreakPoint = true;
                    if (point.enabled) {
                        isEnabled = true;
                    }
                }
            }
        }
        if (hasBreakPoint) {
            const className = (isEnabled == true)?
                "enabledBreakPoint":
                "disabledBreakPoint";
            return <div className={className}></div>;
        }
    };

    /**
     * Callback when a node is toggled.
     * @param {Event} e
     * @param {Object} node
     */
    const clickToggle = (e, node) => {
        e.preventDefault();
        e.stopPropagation();
        if (node.collapsible) {
            toggleCollapse(node);
        }
    };

    /**
     * Call back when a node is selected.
     * @param {Event} e
     * @param {Object} node
     */
    const clickSelectNode = (e, node) => {
        e.preventDefault();
        selectNode(node);
        setCollapsed(node, false);
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
        for (let i = 0; i < node.level; i++) {
            spacers.push(
                <div className="spacer" key={i}>
                    <div className="vertical-line"></div>
                </div>
            );
        }
        return spacers;
    };

    /**
     * Get the node icon type.
     * @return {JSX}
     */
    const getNodeIconType = () => {
        if (node.isBehavior) {
            return <Stack
                title="Function Call"
                style={{color: "orange"}}/>;
        }
    };

    return (
        <div style={selectedStyle} id={"row" + node.index}
            className="abstractionRow">

            <div className="icon-container">
                {getBreakPoint()}
            </div>

            <div className="icon-container">
                <div className="icon">
                    {getNodeIconType()}
                </div>
            </div>

            <div className="flex-grow-1 d-flex flex-row w-100"
                onClick={(e) => clickSelectNode(e, node)}>

                <div className="d-flex flex-row">
                    {getSpacers(node)}
                </div>

                <div onClick={(e) => clickToggle(e, node)} className="collapse-icon-container">
                    {getCollapsed(node)}
                </div>


                {
                    node.behavior ?
                        <div className="text-container flex-grow-1">
                            <span>{node.intent}</span>
                        </div>:
                        <div className="text-container flex-grow-1">
                            <span>{node.entry.id}</span>
                        </div>
                }

                {hasViolation ?
                    <div className="analysis-status-container">
                        <span className="message">{debugText}</span>
                    </div>:
                    <></>
                }

            </div>
        </div>
    );
}
