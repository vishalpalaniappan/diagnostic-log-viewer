import React, {useRef, useState} from "react";

import {Bug, Gear, Keyboard} from "react-bootstrap-icons";

import {DebugContainer} from "../../Components/DebugContainer/DebugContainer";
import {SettingsContainer} from "../../Components/SettingsContainer/SettingsContainer";
import {ShortcutContainer} from "../../Components/ShortcutContainer/ShortcutContainer";

import "./RightSideContainer.scss";

/**
 * Renders the side menu and accordian containers.
 * @return {JSX.Element}
 */
export function RightSideContainer () {
    const [activeMenu, setActiveMenu] = useState(1);

    const accordian = useRef();
    const handle = useRef();

    const SIDE_MENU_WIDTH = 50;
    const ACCORDIAN_WIDTH = 300;
    const MIN_EDITOR_WIDTH = 400;
    const MIN_ACCORDIAN_WIDTH = 200;
    const MAX_ACCORDIAN_WIDTH = document.body.clientWidth - SIDE_MENU_WIDTH - MIN_EDITOR_WIDTH;

    let downValueX;
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        handle.current.classList.add("handle-active");
        downValueX = e.clientX;
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.clientX - downValueX;
        const newWidth = accordian.current.getBoundingClientRect().width - delta;
        if (newWidth > MIN_ACCORDIAN_WIDTH && newWidth < MAX_ACCORDIAN_WIDTH) {
            accordian.current.style.width = newWidth + "px";
            downValueX = e.clientX;
        }
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        handle.current.classList.remove("handle-active");
    };

    const getActiveMenuComponent = () => {
        if (activeMenu === 1) {
            return <DebugContainer />;
        } else if (activeMenu === 2) {
            return <SettingsContainer />;
        } else if (activeMenu === 3) {
            return <ShortcutContainer />;
        }
    };

    return (
        <div className="side-container d-flex flex-row">
            <div className="handle" ref={handle} onMouseDown={handleMouseDown}></div>
            <div className="accordian" ref={accordian} style={{width: ACCORDIAN_WIDTH+"px"}}>
                {getActiveMenuComponent()}
            </div>
        </div>
    );
}
