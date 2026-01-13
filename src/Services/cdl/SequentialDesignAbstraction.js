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
    };
}

export default SequentialDesignAbstraction;
