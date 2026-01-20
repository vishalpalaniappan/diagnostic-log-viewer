import SemanticAbstraction from "./SemanticAbstraction";
/**
 * This class contains the output of the semantic transform.
 */
class SemanticModel {
    /**
     * Initializes the semantic trace.
     */
    constructor() {
        this.type = "semantic";
        this.atomicAbstractions = {};
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
     * @param {String} uid
     */
    addAtomicAbstraction (uid) {
        this.atomicAbstractions[uid] = new SemanticAbstraction();
    }
}

export const SemanticTrace = new SemanticModel();
