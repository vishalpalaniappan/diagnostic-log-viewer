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
        this.behavioralExecution = {};
        this.behavioralException = {};
        this.behavioralViolation = {};
        this.behavioralTree = [];
        for (let i = 0; i < this.behaviors.length; i++) {
            this.behavioralExecution[this.behaviors[i].id] = [];
            this.behavioralException[this.behaviors[i].id] = [];
            this.behavioralViolation[this.behaviors[i].id] = [];
        }
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
        this.normalizeExecutionLevels();
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
                this.appendExecution(behavior.id, entry);
                this.buildBehavioralTree(behavior, entry.behavior);
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
                this.appendExecution(this.currConn.id, entry);

                this.buildBehavioralTree(this.currConn, entry.behavior);
                const behaviors = this.currConn.behaviors;
                if (behaviors[behaviors.length - 1] === entry.behavior.id) {
                    const behavior = this.getBehavior(threadBehavior[pos + 1].behavior.id);
                    if (behavior.id === "SelectEnd") {
                        this.appendExecution(behavior.id, threadBehavior[pos + 1]);
                        this.buildBehavioralTree(behavior, threadBehavior[pos + 1].behavior);
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
     * Prints tracked behavior for easy debugging. This will
     * be extended to build the behavioral tree.
     * @param {String} behavior Behavior of concurrent execution.
     * @param {String} entryBehavior Behavior of current enrty.
     */
    buildBehavioralTree (behavior, entryBehavior) {
        // console.log(behavior.id, entryBehavior.id);
        if (this.behavioralTree.length > 0) {
            const lastEntry = this.behavioralTree[this.behavioralTree.length - 1];
            if (lastEntry.id !== behavior.id) {
                this.behavioralTree.push({
                    "level": behavior.level - 1,
                    "intent": behavior.intention,
                    "id": behavior.id,
                    "type": behavior.type,
                });
            }
        } else {
            this.behavioralTree.push({
                "level": behavior.level - 1,
                "intent": behavior.intention,
                "id": behavior.id,
                "type": behavior.type,
            });
        }
    }


    /**
     * Append the entry execution to the behavioral execution
     * @param {Number} id Id of the behavior
     * @param {Object} entry Contains the execution.
     */
    appendExecution(id, entry) {
        for (let i = 0; i < entry.execution.length; i++) {
            const execution = entry.execution[i];
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

export default ConcurrentBehavior;
