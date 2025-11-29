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


    const checkAbstractions = (entry, index) => {
        for (const abstraction of entry) {
            // console.log(abstraction, index, entry.index);
            if ("abstractions" in abstraction) {
                checkAbstractions(abstraction["abstractions"]);
            } else {
                if (abstraction.index === index) {
                    console.log("FOUND:", abstraction);
                }
            }
        }
    };

    const getPostitionFromIndex = (index) => {
        console.log("Getting index:", index);
        const stack = stacks[activeThread].stack.callStack;

        for (const entry of stack) {
            if ("abstractions" in entry) {
                checkAbstractions(entry["abstractions"], index);
            }
        }
    };

    const selectAbstraction = (e, abstraction) => {

        // console.log(abstraction, abstraction["abstraction"]);
        if (typeof abstraction["abstractions"] === "object") {
            abstraction = abstraction["abstractions"][0];
        }

        console.log(abstraction, stacks[threadId].stack.callStack);
        
        setStackPosition(abstraction.index);
        setActiveThread(threadId);
        setActiveFile(stacks[threadId].stack.callStack[abstraction.index].filePath);
        // getPostitionFromIndex(abstraction.index);
        // setAbstractionPosition(abstraction);
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
    }, [abstractions, stackPosition]);

    const toggleAbstraction = (abstraction) => {
        console.log(abstraction);
        if (abstraction.toggle === undefined) {
            abstraction.toggle = false;
        }
        abstraction.toggle = !abstraction.toggle;
        getAbstractions();
    };


    const getAbstractions = () => {
        if (!abstractions || abstractions === undefined) {
            return;
        }
        const absList = [];
        for (const key in abstractions) {
            if (!key) continue;
            const abstraction = abstractions[key];

            if (typeof abstraction["abstractions"] !== "object") {
                console.log(stackPosition, abstraction.index);
                const isSelected = (stackPosition === abstraction.index);
                const color = (isSelected)?"green":"grey";
                absList.push(
                    <div className="abstraction" key={key}
                        onClick={(e) => selectAbstraction(e, abstraction)}>
                        <span style={{color: color}}>
                            {abstraction.intent}
                        </span>
                    </div>
                );
                continue;
            }

            const isSelected = (stackPosition === abstraction["abstractions"][0].index);
            const color = (isSelected)?"green":"grey";
            // Add the intention of a collapsible abstraction.
            absList.push(
                <div className="abstraction" key={key}
                    onClick={(e) => selectAbstraction(e, abstraction)}>
                    <span>
                        {!abstraction.toggle || abstraction.toggle === undefined ?
                            <CaretRight role="button" className="me-1"
                                style={{color: "grey"}}
                                onClick={() => {toggleAbstraction(abstraction);}}/>:
                            <CaretDown role="button" className="me-1"
                                style={{color: "grey"}}
                                onClick={() => {toggleAbstraction(abstraction);}}/>
                        }
                        <span style={{color: color}}>
                            {abstraction.intent}
                        </span>
                    </span>
                </div>
            );

            // If the abstraction is not toggled, then hide the intentions;
            if (!abstraction.toggle) {
                continue;
            }

            abstraction["abstractions"].forEach((child, index) => {
                console.log(stackPosition, child);
                const isSelected = (stackPosition === child.index);
                const color = (isSelected)?"green":"grey";
                absList.push(
                    <div className="abstraction"
                        style={{paddingLeft: "50px"}}
                        key={index + String(absList.length)}
                        onClick={(e) => selectAbstraction(e, child)}>
                        <span style={{color: color}}>
                            {child.intent}
                        </span>
                    </div>
                );
            });
        }

        setAbs(absList);
    };

    return (
        <>
            {/* <div style={rowStyle} onClick={(e) => selectStackPosition(e)}
                className="stack-row w-100 d-flex flex-row">
                <div style={nameStyle}>{functionName}</div>
                <div className="flex-grow-1 d-flex justify-content-end">
                    <div className="file-name">{fileName}</div>
                    <div className="pill">{lineno}:1</div>
                </div>
            </div> */}
            <div className="d-flex flex-column">
                {abs}
            </div>
        </>
    );
}
