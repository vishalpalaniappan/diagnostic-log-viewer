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
        for (let j = position; j < threadBehavior.length; j++) {
            const entry = threadBehavior[j];
            if (entry?.outputs.length > 0) {
                console.log(entry.behavior.id);
                console.log("Found output, will trace to next position");
            }
        }
    }
};

export default ConcurrentBehavior;
