import SemanticAbstraction from "./SemanticAbstraction";
/**
 * This class contains the output of the semantic transform.
 */
class SemanticModel {
    /**
     * Initializes the semantic trace.
     */
    constructor () {
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
     * Starts an atomic abstraction to the
     * list and sets its as the active abstraction.
     * @param {String} uid
     */
    startAtomicAbstraction (uid) {
        console.log("Started atomic abstraction");
        this.atomicAbstractions[uid] = new SemanticAbstraction();
        this.atomicAbstractions[uid].complete = false;
        this.activeAbstraction = this.atomicAbstractions[uid];
    }

    /**
     * Ends the atomic abstraction.
     * @param {String} uid
     */
    endActiveAtomicAbstraction () {
        console.log("Ended atomic abstraction");
        this.activeAbstraction.complete = true;
        this.activeAbstraction = null;
    }


    /**
     * Forks the active abstraction at the current position.
     */
    startForkActiveAbstraction () {
        console.log("Forking active abstraction");
        this.activeAbstraction.startFork();
    }

    /**
     * Forks the active abstraction at the current position.
     */
    endForkActiveAbstraction () {
        console.log("Ending Fork from active abstraction");
        this.activeAbstraction.endFork();
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
