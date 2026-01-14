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
        this.behavioralExecution[initialThread] = [];
        this.behavioralException[initialThread] = [];
        this.behavioralViolation[initialThread] = [];

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
        this.behavioralTree.push(threadBehavior[this.initialPosition]);
        console.log(threadBehavior[this.initialPosition]);
        let position = this.initialPosition + 1;
        do {
            const entry = {...threadBehavior[position]};
            entry.level = 1;
            const isAtomic = this.isAtomic(entry.behavior.id);
            if (isAtomic && position !== this.initialPosition) {
                break;
            }
            this.behavioralTree.push(entry);
            this.appendExecution(entry.behavior.id, entry);
            console.log(entry.behavior.id);
        } while (++position < threadBehavior.length);
    }


    /**
     * Append the entry execution to the behavioral execution
     * @param {Number} id Id of the behavior
     * @param {Object} entry Contains the execution.
     */
    appendExecution (id, entry) {
        for (let i = 0; i < entry.execution.length; i++) {
            const execution = entry.execution[i];
            console.log(execution);
            this.behavioralExecution[id].push(entry.execution[i]);
            if (execution?.exception) {
                this.behavioralException[id] = this.behavioralException[id].concat(
                    execution.exception
                );
            }
            if (execution.violations.length > 0) {
                this.behavioralViolation[id] = this.behavioralViolation[id].concat(
                    execution.violations
                );
            }
        }
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
