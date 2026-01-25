
import CDL_WORKER_PROTOCOL from "../../../CDL_WORKER_PROTOCOL";
import AtomicSemanticAbstraction from "./AtomicSemanticAbstraction";

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
        this.atomicAbstractionTrees = {};
        this.activeAbstraction = null;
    }

    /**
     * Sets the instrumented design of the
     * transformed trace.
     * @param {Object} DALSpec
     */
    setDesign (DALSpec) {
        this.DALSpec = DALSpec;
    }

    /**
     * Starts an atomic abstraction to the
     * list and sets its as the active abstraction.
     * @param {String} uid
     * @param {Object} abs
     */
    startAtomicAbstraction (uid, abs) {
        console.log("Started atomic abstraction");
        this.atomicAbstractions[uid] = new AtomicSemanticAbstraction(uid, this.DALSpec);
        this.atomicAbstractions[uid].complete = false;
        this.atomicAbstractions[uid].abs = abs;
        this.activeAbstraction = this.atomicAbstractions[uid];
    }

    /**
     * Ends the atomic abstraction.
     * @param {String} uid
     */
    endActiveAtomicAbstraction () {
        console.log("Ended atomic abstraction");
        this.activeAbstraction.complete = true;
        const tree = this.activeAbstraction.processSteps();
        console.log("");
        tree.display();
        this.atomicAbstractionTrees[this.activeAbstraction.atomicUid] = tree;
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
     * Ends the active for in the active abstraction.
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

    /**
     * Sends the model to the UI thread.
     */
    sendModel () {
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_BEHAVIOR,
            args: {
                semanticModel: this,
            },
        });
    }
}

export const SemanticTrace = new SemanticModel();
