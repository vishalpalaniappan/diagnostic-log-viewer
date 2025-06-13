import React, {useCallback, useContext, useEffect, useState} from "react";

import {
    Controls,
    Panel,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import PropTypes from "prop-types";

import {getLayoutedElements} from "./DagreLayout.js";
import {getNodesFromTrace} from "./helper.js";

import "@xyflow/react/dist/style.css";
import "./TraceDiagram.scss";


const Flow = ({trace}) => {
    const {fitView} = useReactFlow();
    const [colorMode, setColorMode] = useState("dark");
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (trace) {
            // Set initial layout of nodes with a vertical layout
            const flowInfo = getNodesFromTrace(trace);
            const layouted = getLayoutedElements(
                flowInfo.nodes,
                flowInfo.edges,
                {direction: "TB"}
            );

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            fitView();
        }
    }, [trace]);

    const onNodeClick = (e, node) => {
        setActiveNode(node);
    };

    const onPanelClick = (e, node) => {
        setActiveNode(node);
    };

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            colorMode={colorMode}
            onNodeClick={onNodeClick}
            onPaneClick={onPanelClick}
            fitView
        >
            <Controls />
        </ReactFlow>
    );
};

Flow.propTypes = {
    trace: PropTypes.array,
};

export const TraceDiagram = ({traces}) => {
    const [traceList, setTraceList] = useState();

    return (
        <ReactFlowProvider>
            <Flow trace={{}} />
        </ReactFlowProvider>
    );
};

TraceDiagram.propTypes = {
    traces: PropTypes.array,
};
