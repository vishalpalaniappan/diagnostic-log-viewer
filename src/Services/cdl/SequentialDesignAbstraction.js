/**
 * This class holds the sequential design abstraction
 * and processes it using the metadata. It represents
 * an atomic abstraction in the design with no behavioral
 * forks.
 */
class SequentialDesignAbstraction {
    /**
     * Initializes the sequential design abstraction.
     * @param {Object} sequentialAbstraction
     * @param {Array} threadExecutionBehaviors
     * @param {Array} allBehaviors
     */
    constructor (sequentialAbstraction, threadExecutionBehaviors, allBehaviors) {
        this.sequentialAbstraction = sequentialAbstraction;
        this.threadExecutionBehaviors = threadExecutionBehaviors;
        this.allBehaviors = allBehaviors;
        this.behavioralExecution = {};
        this.behavioralException = {};
        this.behavioralViolation = {};
        this.behavioralTree = [];
    }

    /**
     * Sets the initial context of the behavior
     * @param {String} initialThread
     * @param {Number} initialPosition
     */
    setInitialContext (initialThread, initialPosition) {
        this.initialThread = initialThread;
        this.initialPosition = initialPosition;
        // Useful debug message, so I'm leaving this here
        console.log("");
        console.log(`Atomic behavior in thread ${initialThread} at position ${initialPosition}`);

        this.traceBehavior();
    };

    /**
     * Trace the behavior from the starting position.
     */
    traceBehavior () {
        const threadBehavior = this.threadExecutionBehaviors[this.initialThread];
        let position = this.initialPosition;
        do {
            const entry = threadBehavior[position];
            console.log(entry.behavior.id);
            const isAtomic = this.isAtomic(entry.behavior.id);
            if (isAtomic && position !== this.initialPosition) {
                break;
            }
        } while (++position < threadBehavior.length);
    }

    /**
     * This function indicates if the behavior is atomic.
     * @param {String} id Id of behavior.
     * @return {Boolean}
     */
    isAtomic (id) {
        for (let i = 0; i < this.allBehaviors.length; i++) {
            const behavior = this.allBehaviors[i];
            if (behavior.id === id) {
                return behavior?.atomic;
            }
        }
    }
}

export default SequentialDesignAbstraction;
