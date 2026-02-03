import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
// eslint-disable-next-line max-len
import {ArrowRepeat, CaretDownFill, CaretRightFill, Check2Square, SignIntersection, SignpostSplit} from "react-bootstrap-icons";

import BehaviorContext from "../../../Providers/BehaviorContext";
import BehavioralGraphContext from "../BehavioralGraphContext";

import "./BehavioralNode.scss";

BehavioralNode.propTypes = {
    node: PropTypes.object,
};

/**
 * Contains a node in the behavioral tree.
 * @param {Object} node
 * @return {JSX.Element}
 */
export function BehavioralNode ({node}) {
    const {activeBehavior} = useContext(BehaviorContext);
    const {selectNode, toggleCollapse} = useContext(BehavioralGraphContext);
    const [selectedStyle, setSelectedStyle] = useState();

    // Set style if node is selected.
    useEffect(() => {
        if (node && activeBehavior) {
            if (activeBehavior.uid === node.uid) {
                setSelectedStyle(
                    {
                        background: "#184b2c",
                        color: "#ffffff",
                        fontSize: "14px",
                    }
                );
            } else {
                if (node.type === "selector") {
                    setSelectedStyle(
                        {
                            color: "grey",
                            cursor: "default",
                        }
                    );
                } else {
                    setSelectedStyle({});
                }
            }
        }
    }, [activeBehavior, node]);

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

    /**
     * Call back when a node is selected.
     * @param {Event} e
     * @param {Object} node
     */ 
    const clickSelectNode = (e, node) => {
        e.preventDefault();
        if (node.type !== "atomic" && node.type !== "selector") {
            selectNode(node);
        }
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
        if (node.level === 0) {
            return <SignIntersection style={{color: "orange"}}/>;
        } else if (node.type === "selector") {
            return <Check2Square title="Select Behavior" style={{color: "grey"}}/>;
        } else if (node.isFork) {
            return <SignpostSplit title="Forked Execution" style={{color: "cyan"}}/>;
        }
    };


    const getBreakPoint = () => {

    };

    const getNode = (node) => {
        if (node.type === "atomic") {
            return `${node.abs.id}`;
        } else if (node.type === "selector") {
            return `${node.step.id}(${node.currStep}/${node.totalSteps})`;
        } else {
            if ("behaviors" in node) {
                return `${node.behaviors[0].sentence}`;
            } else {
                return `${node.step.id}(${node.currStep}/${node.totalSteps})`;
            }
        };
    };

    return (
        <>
            { (node?.level === 0 && node.index !== "0") &&
                <div style={{width: "100%", height: "20px"}}></div>
            }
            <div style={selectedStyle} id={"behavior-row-" + node.uid}
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

                    <div className="text-container flex-grow-1">
                        <span>{getNode(node)}</span>
                    </div>

                    {node?.exceptions?.length > 0 ?
                        <div className="status-behavioral-node exception-label">
                            <span className="message">
                                exception
                            </span>
                        </div>:
                        <></>
                    }

                    {node?.violations?.length > 0 ?
                        <div className="status-behavioral-node violation-label">
                            <span className="message">
                                violation
                            </span>
                        </div>:
                        <></>
                    }

                    {/* {node?.availablityViolation ?
                        <div className="status-behavioral-node availability-label">
                            <span className="message">
                                {node?.availablityViolation}
                            </span>
                        </div>:
                        <></>
                    } */}
                </div>
            </div>
        </>
    );
}
