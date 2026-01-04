import React, {useCallback, useEffect, useRef, useState} from "react";

import {Diagram2, Gear, Keyboard} from "react-bootstrap-icons";

import "./SideMenu.scss";

/**
 * Renders the side menu and accordian containers.
 * @return {JSX.Element}
 */
export function SideMenu () {
    const [activeMenu, setActiveMenu] = useState(1);

    const SIDE_MENU_WIDTH = 50;
    return (
        <div className="side-container d-flex flex-row">
            <div className="menu d-flex flex-column" style={{width: SIDE_MENU_WIDTH+"px"}}>
                <div className="d-flex flex-column align-items-center">
                    <Diagram2 className="menu-icon" size={25}
                        onClick={(e) => {setActiveMenu(1);}}
                        style={{color: activeMenu == 1 ? "white": "grey"}}/>
                </div>
                <div className="mt-auto d-flex flex-column align-items-center">
                    <Keyboard className="menu-icon" size={25}
                        onClick={(e) => {setActiveMenu(2);}}
                        style={{color: activeMenu == 2 ? "white": "grey"}}/>
                    <Gear className="menu-icon" size={25}
                        onClick={(e) => {setActiveMenu(3);}}
                        style={{color: activeMenu == 3 ? "white": "grey"}}/>
                </div>
            </div>
        </div>
    );
}
