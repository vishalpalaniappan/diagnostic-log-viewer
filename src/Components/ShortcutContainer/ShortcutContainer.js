import React, {useEffect, useRef} from "react";

import {Col, Row} from "react-bootstrap";

import "./ShortcutContainer.scss";

/**
 * @return {JSX.Element}
 */
export function ShortcutContainer ({}) {
    const settingsContainer = useRef();
    const kbdContainer = useRef();

    const TITLE_HEIGHT = 20;

    const redrawContainers = () => {
        const height = settingsContainer.current.clientHeight;
        kbdContainer.current.style.height = height - TITLE_HEIGHT + "px";
    };

    useEffect(() => {
        redrawContainers();
    }, []);

    return (
        <div ref={settingsContainer} className="w-100 h-100 settings-container">
            <div className="w-100 title" style={{height: TITLE_HEIGHT + "px"}}>
                Keyboard Shortcuts
            </div>
            <div ref={kbdContainer} className="w-100 shortcuts p-3 pt-1">
                <Row className="mb-2">
                    <Col>Step Over Forward</Col>
                    <Col><kbd>→</kbd></Col>
                </Row>
                <Row className="mb-2">
                    <Col>Step Over Backward</Col>
                    <Col><kbd>←</kbd></Col>
                </Row>
                <Row className="mb-2">
                    <Col>Step Into</Col>
                    <Col><kbd>↓</kbd></Col>
                </Row>
                <Row className="mb-2">
                    <Col>Step Out</Col>
                    <Col><kbd>↑</kbd></Col>
                </Row>
                <Row className="mb-2 mt-3">
                    <Col>Move Down Stack</Col>
                    <Col><kbd>CTRL</kbd> + <kbd>↓</kbd></Col>
                </Row>
                <Row className="mb-2">
                    <Col>Move Up Stack</Col>
                    <Col><kbd>CTRL</kbd> + <kbd>↑</kbd></Col>
                </Row>
                <Row className="mb-2">
                    <Col>Go To Start</Col>
                    <Col><kbd>CTRL</kbd> + <kbd>←</kbd></Col>
                </Row>
                <Row className="mb-2">
                    <Col>Go To End</Col>
                    <Col><kbd>CTRL</kbd> + <kbd>→</kbd></Col>
                </Row>
            </div>
        </div>
    );
}
