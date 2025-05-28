import React, {useContext, useEffect, useRef, useState} from "react";

import PropTypes from "prop-types";

import ThreadsContext from "../../../Providers/ThreadsContext";
import WorkerContext from "../../../Providers/WorkerContext";
import CDL_WORKER_PROTOCOL from "../../../Services/CDL_WORKER_PROTOCOL";

import "./StatusBarMenu.scss";

// Constants
const MENU_WIDTH = 265;

StatusBarMenu.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object),
};

/**
 * Renders a menu above the component in the status bar.
 * @param {string} className CSS classes for the main element
 * @param {boolean} disabled Whether the element is disabled
 * @param {object} children Children contained within these components
 * @return {JSX.Element}
 */
export function StatusBarMenu ({className, disabled, children}) {
    const {threads} = useContext(ThreadsContext);
    const {cdlWorker} = useContext(WorkerContext);

    const [showMenu, setShowMenu] = useState(false);
    const [bottom, setBottom] = useState(null);
    const [left, setLeft] = useState(null);

    const containerEl = useRef();

    // Calculate the position of the menu on window resize
    useEffect(() => {
        let resizeTimeoutId;
        const onResize = () => {
            clearTimeout(resizeTimeoutId);
            resizeTimeoutId = setTimeout(setPositionOfMenu, 100);
            setShowMenu(false);
        };
        window.addEventListener("resize", onResize);
        setPositionOfMenu();
        return () => {
            window.removeEventListener("resize", onResize, false);
        };
    }, []);

    // Setup dismissal of menu on click outside if menu is showing
    useEffect(() => {
        if (showMenu) {
            const handleClickOutside = (event) => {
                if (containerEl.current && false === containerEl.current.contains(event.target)) {
                    setShowMenu(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [showMenu]);

    // Set the position of the menu above the child component
    const setPositionOfMenu = () => {
        const position = containerEl.current.getBoundingClientRect();
        const left = (position.left + (position.right - position.left) / 2) - (MENU_WIDTH / 2);
        setBottom(position.height);
        setLeft(left);
    };

    const toggleMenu = () => {
        setPositionOfMenu();
        setShowMenu(!showMenu);
    };

    const sendToWorker = (code, args) => {
        if (cdlWorker && cdlWorker.current) {
            cdlWorker.current.postMessage({code: code, args: args});
        }
    };

    const selectThread = (index) => {
        const code = CDL_WORKER_PROTOCOL.SELECT_THREAD;
        const args = {
            threadId: threads[index]
        };
        sendToWorker(code, args);
    };

    return (
        <button
            className={className}
            disabled={disabled}
            ref={containerEl}
            onClick={toggleMenu}
        >
            {showMenu &&
                <div
                    className="thread-menu-container"
                    style={{
                        left: `${left}px`,
                        bottom: `${bottom}px`,
                        width: `${MENU_WIDTH}px`,
                    }}
                >

                    {threads &&
                        threads.map((value, index) =>
                            <option
                                className="px-2"
                                key={index}
                                onClick={() => selectThread(index)}
                            >Thread ID: {value}</option>
                        )
                    }
                </div>
            }
            {children}
        </button>
    );
}
