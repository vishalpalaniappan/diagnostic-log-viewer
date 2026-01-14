/**
 * This class is a representation of the concurrent behavioral
 * metadata. It will be used to move forward in the concurrent
 * abstraction as the forks are assembled. It will essentially
 * hold the state of the concurrent behavior as we step
 * through the behavior of the program.
 */
class ConcurrentDesignAbstraction {
    /**
     * Initializes the behavioral meta.
     * @param {Object} concurrentAbstraction
     * @param {Array} threadExecutionBehaviors
     * @param {Array} allBehaviors
     */
    constructor (concurrentAbstraction, threadExecutionBehaviors, allBehaviors) {
        this.concurrentAbstraction = concurrentAbstraction;
        this.numConcurrent = this.concurrentAbstraction.numConcurrent;
        this.concurrentCount = 0;
        this.threadExecutionBehaviors = threadExecutionBehaviors;
        this.behaviors = this.concurrentAbstraction.behaviors;
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
        // console.log("");
        // console.log(`Atomic behavior in thread ${initialThread}
        // at position ${initialPosition}`);

        this.traceAndForkBehavior(initialThread, initialPosition);
        // this.normalizeExecutionLevels();
    }

    /**
     * Normalizes the execution levels of the behaviors. I'm doing this
     * because I am using the levels in the original execution tree. Since
     * I am only displaying a portion of it, I think it makes sense to
     * normalize it. In the future, I can do this in a more intelligent way.
     */
    normalizeExecutionLevels () {
        const minLevels = {};
        const behavioralIds = Object.keys(this.behavioralExecution);

        // Find the min levels for each abstraction
        for (let i = 0; i < behavioralIds.length; i++) {
            const id = behavioralIds[i];
            for (let j = 0; j < this.behavioralExecution[id].length; j++) {
                const entry = this.behavioralExecution[id][j];
                if (!(behavioralIds[i] in minLevels)) {
                    minLevels[behavioralIds[i]] = entry.level;
                } else if (entry.level < minLevels[id]) {
                    minLevels[behavioralIds[i]] = entry.level;
                }
            }
        }

        // Substract the min level from every entry to normalize it
        for (let i = 0; i < behavioralIds.length; i++) {
            const id = behavioralIds[i];
            for (let j = 0; j < this.behavioralExecution[id].length; j++) {
                const entry = this.behavioralExecution[id][j];
                entry.level = entry.level - minLevels[id];
            }
        }
    }


    /**
     *
     * @param {String} threadId
     * @param {Number} position
     * @param {Number} count
     */
    traceAndForkBehavior (threadId, position) {
        let pos = position;
        const threadBehavior = this.threadExecutionBehaviors[threadId];
        do {
            const entry = threadBehavior[pos];
            const behavior = this.getBehavior(entry.behavior.id);
            if (entry?.outputs.length > 0) {
                this.traceConcurrent(threadId, pos);
            } else {
                this.buildBehavioralTree(behavior, entry);
            }
            if (this.concurrentCount === this.numConcurrent) {
                break;
            }
        } while (++pos < threadBehavior.length);
    }

    /**
     * Trace the concurrent function
     * @param {String} threadId
     * @param {Number} pos
     */
    traceConcurrent (threadId, pos) {
        let threadBehavior = this.threadExecutionBehaviors[threadId];
        do {
            const entry = threadBehavior[pos];
            if (this.currConn) {
                this.buildBehavioralTree(this.currConn, entry);
                const behaviors = this.currConn.behaviors;
                if (behaviors[behaviors.length - 1] === entry.behavior.id) {
                    const nextEntry = threadBehavior[pos + 1];
                    const nextBehavior = this.getBehavior(nextEntry.behavior.id);
                    if (nextBehavior.id === "SelectEnd") {
                        this.buildBehavioralTree(nextBehavior, nextEntry);
                    }
                    return;
                }
            }

            if (entry?.outputs.length > 0) {
                const input = this.findInput(entry.outputs[0]);
                if (!input) {
                    const lastEntry = this.behavioralTree[this.behavioralTree.length - 1];
                    const target = this.findOutputTarget(entry.behavior.id);
                    lastEntry.availablityViolation = "missing " + target;
                    console.error("Could not find input, error in trace structure");
                    break;
                } else {
                    pos = input.position;
                    threadBehavior = this.threadExecutionBehaviors[input.threadId];
                }
            }
        } while (++pos < threadBehavior.length);
    }

    /**
     * Given a behavior id, this function finds the behavior
     * from the global list and reads the target information.
     * This information could have easily been saved in the
     * entry instead of doing this manual process again.
     * @param {String} behaviorId ID of the behavior.
     * @return {String}
     */
    findOutputTarget (behaviorId) {
        for (let i = 0; i < this.allBehaviors.length; i++) {
            const behavior = this.allBehaviors[i];
            if (behavior.id === behaviorId) {
                return behavior.target;
            }
        }
    }

    /**
     * Builds the behavioral tree of the concurrent abstraction.
     * Prints tracked behavior for easy debugging.
     * @param {String} behavior Behavior of concurrent execution.
     * @param {String} entry The entry that is being processed.
     */
    buildBehavioralTree (behavior, entry) {
        // Check if we are starting the concurrent section of the
        // designs abstractions to create a section in the UI.
        if (this.behavioralTree.length > 0) {
            const lastEntry = this.behavioralTree[this.behavioralTree.length - 1];
            if (lastEntry.section !== behavior.id && behavior.type === "concurrent") {
                console.log("Concurrent Section");
                /**
                 * This is the start of a concurrent section in the design,
                 * I need to mark the behavior with the section id and I need
                 * to add an entry the behavioral tree to visually group the
                 * behavior of the concurrent section.
                 */
            }
        }

        // Save the level and the section to the entry
        const entryBehavior = {...entry.behavior};
        entryBehavior.level = behavior.level;
        entryBehavior.section = behavior.id;
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
        console.log(behavior.id);
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
                this.currConn = entry;
                this.concurrentCount++;
                return entry;
            } else if (entry.behaviors.includes(id)) {
                return entry;
            }
        }
    }


    /**
     * Given an output, this function finds its corresponding input
     * in the other threads.
     * @param {Object} output
     * @param {String} id
     * @return {Object}
     */
    findInput(output) {
        const outputId = output.value.adliExecutionId;
        const threadIds = Object.keys(this.threadExecutionBehaviors);

        for (let j = 0; j < threadIds.length; j++) {
            const threadBehavior = this.threadExecutionBehaviors[threadIds[j]];
            for (let i = 0; i < threadBehavior.length; i++) {
                const entry = threadBehavior[i];
                if (entry?.inputs.length > 0) {
                    const inputId = entry.inputs[0].value.adliExecutionId;
                    if (inputId === outputId) {
                        return {
                            threadId: threadIds[j],
                            position: i - 1,
                        };
                    }
                }
            }
        };
    };
};

export default ConcurrentDesignAbstraction;
