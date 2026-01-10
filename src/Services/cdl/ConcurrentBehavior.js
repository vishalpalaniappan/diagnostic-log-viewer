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
        let pos = position;
        const threadBehavior = this.threadBehaviors[threadId];
        do {
            const entry = threadBehavior[pos];
            const behavior = this.getBehavior(entry.behavior.id);
            if (entry?.outputs.length > 0) {
                this.traceConcurrent(threadId, pos);
            } else {
                console.log(behavior.id, entry.behavior.id);
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
    traceConcurrent(threadId, pos) {
        let threadBehavior = this.threadBehaviors[threadId];
        do {
            const entry = threadBehavior[pos];

            if (this.currentCouncurrent) {
                console.log(this.currentCouncurrent.id, entry.behavior.id);
                const behaviors = this.currentCouncurrent.behaviors;
                if (behaviors[behaviors.length - 1] === entry.behavior.id) {
                    const behavior = this.getBehavior(threadBehavior[pos + 1].behavior.id);
                    if (behavior.id === "SelectEnd") {
                        console.log(behavior.id, threadBehavior[pos + 1].behavior.id);
                        console.log("Reached end of concurrent behavior (finished last and cleaned up job)");
                    } else {
                        console.log("Reached end of concurrent behavior");
                    }
                    return;
                }
            }

            if (entry?.outputs.length > 0) {
                const input = this.findInput(entry.outputs[0]);
                pos = input.position;
                threadBehavior = this.threadBehaviors[input.threadId];
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
                this.currentCouncurrent = entry;
                this.concurrentCount++;
                return entry;
            } else if (entry.behaviors.includes(id)) {
                return entry;
            }
        }
    }


    /**
     * 
     * @param {Object} output
     * @param {String} id
     * @return {Object}
     */
    findInput(output) {
        const outputId = output.value.adliExecutionId;
        const threadIds = Object.keys(this.threadBehaviors);

        for (let j = 0; j < threadIds.length; j++) {
            const threadBehavior = this.threadBehaviors[threadIds[j]];
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
