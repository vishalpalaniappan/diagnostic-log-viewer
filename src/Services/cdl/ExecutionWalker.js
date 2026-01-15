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
        this.atomicPositions = [];
        this.getAllAtomic();
    }


    /**
     * Get all the atomic behaviors.
     */
    getAllAtomic () {
        const atomicBehaviors = this.DALSpec.getAtomicBehaviors();
        const keys = Object.keys(this.threads);
        for (let i = 0; i < keys.length; i++) {
            const thread = this.threads[keys[i]].thread;
            let currBehavior;
            for (let j = 0; j < thread.execution.length; j++ ) {
                const behavior = thread.header.getBehaviorFromExecution(thread.execution[j]);
                if (behavior) {
                    thread.execution[j].behavior = behavior;
                    if (currBehavior !== behavior.id && atomicBehaviors.includes(behavior.id)) {
                        this.atomicPositions.push(thread.execution[j]);
                    }
                    currBehavior = behavior.id;
                }
            }
        }
        console.log(this.atomicPositions);
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
