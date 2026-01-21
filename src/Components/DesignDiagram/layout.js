
/**
 * Laysout the instrumented design.
 * @param {Object} atomicAbstraction
 * @return {Object}
 */
export const layoutDesign = (atomicAbstraction) => {
    const nodes = [];
    const edges = [];

    const design = atomicAbstraction.design;
    const abstraction = atomicAbstraction.abs;

    console.log("Laying out design:", design);

    processModule(abstraction, design);

    return {
        nodes: nodes,
        edges: edges,
    };
};


const processModule = (node, design) => {
    console.log("");
    for (let i = 0; i < node.steps.length; i++) {
        const step = node.steps[i];
        console.log(step.id);
        if (step.type === "selector") {
            for (let i = 0; i < step.options.length; i++) {
                const option = step.options[i];
                const abs = getDesignAbsFromId(option.id, design);
                processModule(abs, design);
            }
        } else if (step.type === "selector_repeat") {
            const abs = getDesignAbsFromId(step.options[0].id, design);
            processModule(abs, design);
        }
    }
};

const getDesignAbsFromId = (id, design) => {
    for (let i = 0; i < design.length; i++) {
        const entry = design[i];
        if (entry.id === id) {
            return entry;
        }
    }
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
