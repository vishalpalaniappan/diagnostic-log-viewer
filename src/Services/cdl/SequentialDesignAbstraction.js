import {normalizeExecutionLevels} from "./helper.js";
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

        for (let i = 0; i < this.behavioralTree.length; i++) {
            const entry = this.behavioralTree[i];
            normalizeExecutionLevels(entry.execution);
        }
    };

    /**
     * Trace the behavior from the starting position.
     */
    traceBehavior () {
        const threadBehavior = this.threadExecutionBehaviors[this.initialThread];
        this.buildBehavioralTree(threadBehavior[this.initialPosition]);
        console.log(threadBehavior[this.initialPosition]);
        let position = this.initialPosition + 1;
        do {
            const entry = {...threadBehavior[position]};
            entry.level = 1;
            const isAtomic = this.isAtomic(entry.behavior.id);
            if (isAtomic && position !== this.initialPosition) {
                break;
            }
            this.buildBehavioralTree(entry);
            console.log(entry.behavior.id);
        } while (++position < threadBehavior.length);
    }


    /**
     * Builds the behavioral tree of the sequential abstraction.
     * Prints tracked behavior for easy debugging.
     * @param {String} entry The entry that is being processed.
     */
    buildBehavioralTree (entry) {
        // Save the level and the section to the entry
        const entryBehavior = {...entry.behavior};
        entryBehavior.level = entry.level;
        entryBehavior.execution = entry.execution;
        entryBehavior.exception = [];
        entryBehavior.violation = [];

        // Save the exceptions and violations
        for (let i = 0; i < entry.execution.length; i++) {
            const exec = entry.execution[i];
            if (exec.exception) {
                entryBehavior.exception.push(exec.exception);
            }
            for (let j = 0; j < exec.violations.length; j++) {
                if (exec.violations[j]) {
                    entryBehavior.violation.push(exec.violations[j]);
                }
            }
        }

        // Add the entry to the behavioral tree
        this.behavioralTree.push(entryBehavior);
        console.log(entry.behavior.id);
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
