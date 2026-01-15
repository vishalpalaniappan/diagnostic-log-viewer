import DAL from "./DAL";
/**
 * Walks the execution given all the thread files. It is used
 * by the DAL object to move through the execution using the
 * design.
 */
class ExecutionWalker {
    /**
     * Initialize the execution walker with the threads.
     * @param {Object} threads
     * @param {Object} design
     */
    constructor (threads, design) {
        this.threads = threads;
        this.DALSpec = new DAL(design);
        console.log("Initialized execution walker with threads:", threads);
    }

    /**
     * Scans the threads for atomic behaviors to being
     * walking with the DALSpec.
     */
    scanForAtomic () {

    }

    /**
     * Moves to the next execution in the execution when requested
     * by the DAL. It does not set the state until DAL verifies
     * that the design expects this move.
     */
    getNext () {

    }

    /**
     * Tracks an output to the new position and sets the state.
     */
    trackOutput () {

    }
}

export default ExecutionWalker;
