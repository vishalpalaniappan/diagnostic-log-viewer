/**
 * Class to layout the design into nodes and edges.
 */
class LayoutDesign {
    /**
     * Initialize the class
     */
    constructor () {

    }

    /**
     * Processes the design.
     * @param {Object} atomicAbstraction
     * @return {Object}
     */
    processDesign (atomicAbstraction) {
        const nodes = [];
        const edges = [];

        this.design = atomicAbstraction.design;
        const abstraction = atomicAbstraction.abs;

        console.log("Laying out design:", this.design);

        this.processModule(abstraction);

        return {
            nodes: nodes,
            edges: edges,
        };
    }

    /**
     * Processes the module.
     * @param {Object} node
     */
    processModule (node) {
        console.log("");
        for (let i = 0; i < node.steps.length; i++) {
            const step = node.steps[i];
            console.log(step.id);
            if (step.type === "selector") {
                for (let i = 0; i < step.options.length; i++) {
                    const option = step.options[i];
                    const abs = this.getDesignAbsFromId(option.id);
                    this.processModule(abs);
                }
            } else if (step.type === "selector_repeat") {
                const abs = this.getDesignAbsFromId(step.options[0].id);
                this.processModule(abs,);
            }
        }
    }

    /**
     * Gets the design abs given the id.
     * @param {String} id
     * @return {Object|null}
     */
    getDesignAbsFromId (id) {
        for (let i = 0; i < this.design.length; i++) {
            const entry = this.design[i];
            if (entry.id === id) {
                return entry;
            }
        }
    }
}

export default LayoutDesign;

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
