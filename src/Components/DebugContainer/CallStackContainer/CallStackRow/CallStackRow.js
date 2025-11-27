import React, {useContext, useEffect, useState} from "react";

import PropTypes from "prop-types";
import {CaretDown, CaretRight} from "react-bootstrap-icons";

import ActiveFileContext from "../../../../Providers/ActiveFileContext";
import StackContext from "../../../../Providers/StackContext";
import StackPositionContext from "../../../../Providers/StackPositionContext";

import "./CallStackRow.scss";

CallStackRow.propTypes = {
    index: PropTypes.number,
    functionName: PropTypes.string,
    filePath: PropTypes.string,
    fileName: PropTypes.string,
    lineno: PropTypes.number,
    abstractions: PropTypes.array,
    position: PropTypes.number,
    main: PropTypes.bool,
    threadId: PropTypes.string,
};

/**
 * Renders a call stack row.
 * @param {String} functionName
 * @param {String} filePath
 * @param {String} fileName
 * @param {Number} lineno
 * @param {Array} abstractions
 * @param {Number} position
 * @param {Boolean} main
 * @param {String} threadId
 * @return {JSX}
 */
export function CallStackRow (
    {index, functionName, filePath, fileName, lineno, position, abstractions, main, threadId}) {
    const {stackPosition, setStackPosition} = useContext(StackPositionContext);
    const {stacks, activeThread, setActiveThread} = useContext(StackContext);
    const {setActiveFile} = useContext(ActiveFileContext);

    const [abs, setAbs] = useState();
    const [rowStyle, setRowStyle] = useState();
    const [nameStyle, setNameStyle] = useState();

    /**
     * Callback when stack position is selected.
     * @param {Event} e
     */
    const selectStackPosition = (e) => {
        setStackPosition(index);
        setActiveThread(threadId);
        setActiveFile(stacks[threadId].stack.callStack[index].filePath);
    };

    const setStyle = (currStack) => {
        const exceptions = currStack[index].exceptions;
        const hasException = (exceptions && exceptions.length > 0);
        if (index === stackPosition) {
            setNameStyle();
            if (index === 0 && hasException) {
                setRowStyle({backgroundColor: "#420b0e"});
            } else if (index === 0) {
                setRowStyle({backgroundColor: "#373700"});
            } else {
                setRowStyle({backgroundColor: "#184b2d"});
            }
        } else {
            setRowStyle();
            if (hasException) {
                setNameStyle({color: "#ff8c92"});
            } else {
                setNameStyle({color: "white"});
            }
        }
    };

    useEffect(() => {
        if (stacks && activeThread && threadId in stacks) {
            const currStack = stacks[threadId].stack.callStack;
            if (activeThread == threadId && index < currStack.length) {
                setStyle(currStack);
            } else {
                setRowStyle({});
                setNameStyle({});
            }
        }
    }, [stacks, stackPosition, activeThread]);


    useEffect(() => {
        getAbstractions();
    }, [abstractions]);

    const toggleAbstraction = (abstraction) => {
        console.log(abstraction);
        if (abstraction.toggle === undefined) {
            abstraction.toggle = false;
        }
        abstraction.toggle = !abstraction.toggle;
        getAbstractions();
    };


    const getAbstractions = () => {
        if (abstractions) {
            const absList = [];
            abstractions.forEach((abstraction, key) => {
                if (typeof abstraction["abstraction"] === "object") {
                    // Add the intention of a collapsible abstraction.
                    absList.push(
                        <div className="abstraction" style={{height: "30px"}} key={key}>
                            <span >
                                {!abstraction.toggle || abstraction.toggle === undefined ?
                                    <CaretRight role="button" className="me-1"
                                        style={{color: "grey"}}
                                        onClick={() => {toggleAbstraction(abstraction);}}/>:
                                    <CaretDown role="button" className="me-1"
                                        style={{color: "grey"}}
                                        onClick={() => {toggleAbstraction(abstraction);}}/>
                                }
                                {abstraction.intent}
                            </span>
                        </div>
                    );

                    // If the abstraction is toggled, then show the intentions.
                    if (abstraction.toggle) {
                        abstraction["abstraction"].forEach((child, index) => {
                            absList.push(
                                <div className="abstraction"
                                    style={{height: "30px", paddingLeft: "50px"}}
                                    key={index + String(absList.length)}>
                                    {child.intent}
                                </div>
                            );
                        });
                    }
                } else {
                    // Add the intentions that don't have any
                    // collapsible information.
                    absList.push(
                        <div className="abstraction" style={{height: "30px"}} key={key}>
                            {abstraction.intent}
                        </div>
                    );
                }
            });

            setAbs(absList);
        }
    };

    return (
        <>
            <div style={rowStyle} onClick={(e) => selectStackPosition(e)}
                className="stack-row w-100 d-flex flex-row">
                <div style={nameStyle}>{functionName}</div>
                <div className="flex-grow-1 d-flex justify-content-end">
                    <div className="file-name">{fileName}</div>
                    <div className="pill">{lineno}:1</div>
                </div>
            </div>
            <div className="d-flex flex-column">
                {abs}
            </div>
        </>
    );
}
