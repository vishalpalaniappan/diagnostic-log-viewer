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
        this.activeAbstraction = this.atomicAbstractions[uid];
    }

    /**
     * Records the trace into the active abstraction.
     * @param {String} entry
     */
    recordTrace (entry) {
        this.activeAbstraction.addToTrace(entry);
    }
}

export const SemanticTrace = new SemanticModel();
