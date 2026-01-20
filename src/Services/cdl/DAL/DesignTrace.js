/**
 * This class contains the output of the semantic transform.
 */
class SemanticTrace {
    /**
     * Initializes the semantic trace.
     */
    constructor() {
        this.type = "semantic";
    }

    /**
     * Sets the instrumented design of the
     * transformed trace.
     * @param {Object} design
     */
    setDesign (design) {
        this.design = design;
    }
}

export const DesignTrace = new SemanticTrace();
