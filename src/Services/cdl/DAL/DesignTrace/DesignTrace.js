/**
 * This class contains the output of the semantic transform.
 */
class SemanticTrace {
    /**
     * Initializes the semantic trace.
     */
    constructor() {
        this.type = "semantic";
        this.atomicAbstractions = [];
        this.activeAbstraction = null;
    }

    /**
     * Sets the instrumented design of the
     * transformed trace.
     * @param {Object} design
     */
    setDesign (design) {
        this.design = design;
    }

    /**
     * Adds an atomic abstraction to the
     * list and sets its as the active abstraction.
     */
    addAtomicAbstraction () {

    }
}

export const DesignTrace = new SemanticTrace();
