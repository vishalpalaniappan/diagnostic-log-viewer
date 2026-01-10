/**
 * This class is a representation of the concurrent behavioral
 * metadata. It will be used to move forward in the concurrent
 * abstraction as the forks are assembled. It will essentially
 * hold the state of the concurrent behavior as we step
 * through the behavior of the program.
 */
class ConcurrentBehavior {
    /**
     * Initializes the behavioral meta.
     * @param {Object} concurrentAbstraction
     * @param {Array} threadBehaviors
     */
    constructor (concurrentAbstraction, threadBehaviors) {
        this.concurrentAbstraction = concurrentAbstraction;
        this.numConcurrent = this.concurrentAbstraction.numConcurrent;
        this.concurrentCount = 0;
        this.threadBehaviors = threadBehaviors;
    }

    /**
     * Sets the initial context of the behavior
     * @param {String} initialThread
     * @param {Number} initialPosition
     */
    setInitialContext(initialThread, initialPosition) {
        this.initialThread = initialThread;
        this.initialPosition = initialPosition;
        console.log("");
        console.log(`Atomic behavior in thread ${initialThread} at position ${initialPosition}`);

        this.traceAndForkBehavior(initialThread, initialPosition);
    }


    /**
     *
     * @param {String} threadId
     * @param {Number} position
     * @param {Number} count
     */
    traceAndForkBehavior (threadId, position) {
        const threadBehavior = this.threadBehaviors[threadId];
        let pos = position;
        do {
            const entry = threadBehavior[pos];
            const behavior = this.getBehavior(entry.behavior.id);
            console.log(behavior.id);
            if (entry?.outputs.length > 0) {
                console.log("Found output, will trace to next position");
            }
            if (this.concurrentCount === this.numConcurrent) {
                console.log("We are done");
                break;
            }
        } while (++pos < threadBehavior.length);
    }


    /**
     * Gets the behavior given the id.
     * @param {String} id
     * @return {Object} entry
     */
    getBehavior (id) {
        const behaviors = this.concurrentAbstraction.behaviors;
        for (let i = 0; i < behaviors.length; i++) {
            const entry = behaviors[i];
            if (entry.type === "concurrent" && entry.behaviors[0] === id) {
                this.concurrentCount++;
                return entry;
            } else if (entry.behaviors.includes(id)) {
                return entry;
            }
        }
    }
};

export default ConcurrentBehavior;
