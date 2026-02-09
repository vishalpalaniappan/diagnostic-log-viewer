import React, {useCallback, useEffect, useRef, useState} from "react";

import {SettingsContainer} from "../../../Components/SettingsContainer/SettingsContainer";
import {ShortcutContainer} from "../../../Components/ShortcutContainer/ShortcutContainer";
// eslint-disable-next-line max-len
import {BehavioralDebugContainer} from "./BehavioralDebugContainer/BehavioralDebugContainer";

import "./LeftSideContainerBehavioral.scss";

/**
 * Renders the side menu and accordian containers.
 * @return {JSX.Element}
 */
export function LeftSideContainerBehavioral () {
    const [activeMenu, setActiveMenu] = useState(1);

    const accordian = useRef();
    const handle = useRef();
    const downValueX = useRef();

    const SIDE_MENU_WIDTH = 50;
    const ACCORDIAN_WIDTH = 500;
    const MIN_EDITOR_WIDTH = 400;
    const MIN_ACCORDIAN_WIDTH = 200;

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        handle.current.classList.add("handle-active");
        downValueX.current = e.clientX;
    };

    const handleMouseMove = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.clientX - downValueX.current;
        const newWidth = accordian.current.getBoundingClientRect().width + delta;
        const MAX_ACCORDIAN_WIDTH = document.body.clientWidth - SIDE_MENU_WIDTH - MIN_EDITOR_WIDTH;
        if (newWidth > MIN_ACCORDIAN_WIDTH && newWidth < MAX_ACCORDIAN_WIDTH) {
            accordian.current.style.width = newWidth + "px";
            downValueX.current = e.clientX;
        }
    }, []);

    const handleMouseUp = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        handle.current.classList.remove("handle-active");
    }, [handleMouseMove]);

    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const getActiveMenuComponent = () => {
        if (activeMenu === 1) {
            return <BehavioralDebugContainer />;
        } else if (activeMenu === 2) {
            return <ShortcutContainer />;
        } else if (activeMenu === 3) {
            return <SettingsContainer />;
        }
    };

    return (
        <div className="side-container d-flex flex-row">
            <div className="accordian" ref={accordian} style={{width: ACCORDIAN_WIDTH+"px"}}>
                {getActiveMenuComponent()}
            </div>
            <div className="handle" ref={handle} onMouseDown={handleMouseDown}></div>
        </div>
    );
}
