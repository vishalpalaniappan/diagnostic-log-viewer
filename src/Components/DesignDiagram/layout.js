
/**
 * Laysout the instrumented design.
 * @param {Object} design
 * @return {Object}
 */
export const layoutDesign = (atomicAbstraction) => {
    const nodes = [];
    const edges = [];

    const design = atomicAbstraction.design;

    console.log("Laying out design:", design);

    return {
        nodes: nodes,
        edges: edges,
    };
};

/**
 * This function creates nodes and edges for the provided
 * atomic abstraction.
 * @param {Object} atomicAbstraction
 * @return {Object}
 */
export const layoutTrace = (atomicAbstraction) => {
    const trace = atomicAbstraction.trace;
    console.log("Laying out trace:", trace);

    const nodes = [];
    for (let i = 0; i < trace.length; i++) {
        const node = {
            id: trace[i].uid,
            position: {x: 0, y: (i + 1) * 100},
            data: {label: trace[i].step.id},
        };
        nodes.push(node);
    }

    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        const firstNode = nodes[i];
        const secondNode = nodes[i + 1];
        const edge = {
            id: firstNode.id + "-" + secondNode.id,
            source: firstNode.id,
            target: secondNode.id,
        };
        edges.push(edge);
    }
    return {
        nodes: nodes,
        edges: edges,
    };
};
