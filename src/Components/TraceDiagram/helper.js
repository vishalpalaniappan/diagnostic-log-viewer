import {MarkerType} from "@xyflow/react";

const marker = {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#FF0072",
};

const arrowStyle = {
    strokeWidth: 2,
    stroke: "#FF0072",
};

/**
 * Returns react flow nodes and edges from the given trace.
 * @param {Object} trace A trace to convert to react flow compatible
 *                       node and edge structure.
 * @return {Array} An object which contains the nodes and edges.
 */
export const getNodesFromTrace = (trace) => {
    const edges = [];
    const nodes = [];

    const edgeIds = [];

    // Validate input
    if (!Array.isArray(trace) || trace.length === 0) {
        return {nodes, edges};
    }

    trace.forEach((branch, index) => {
        branch.forEach((node, index) => {
            node.flowId = String(index) + "-" + node.position;

            // The initial position doesn't matter because we will
            // be using other algorithms to layout the nodes.
            const flowNode = {
                id: node.flowId,
                position: {x: 250, y: index * 200},
                data: {label: node.varName},
            };
            flowNode.sourceNode = node;
            nodes.push(flowNode);

            if (index > 0) {
                const prevNode = branch[index - 1];
                const id = node.flowId + "-" + prevNode.flowId;

                if (!edgeIds.includes(id)) {
                    edgeIds.push(id);
                    const edge = {
                        id: node.flowId + "-" + prevNode.flowId,
                        source: node.flowId,
                        target: prevNode.flowId,
                        animated: true,
                        markerEnd: marker,
                        style: arrowStyle,
                    };
                    edges.push(edge);
                }
            }
        });
    });

    return {
        nodes: nodes,
        edges: edges,
    };
};
