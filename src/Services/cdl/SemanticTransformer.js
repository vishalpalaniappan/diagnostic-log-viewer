
/**
 * This class is responsible for performing the semantic transformation
 * on the threads to observe the behavior of the design.
 */
class SemanticTransformer {
    /**
     * Initializes the semantic transformer.
     * @param {Object} designMap
     * @param {Object} threadDebuggers
     */
    constructor (designMap, threadDebuggers) {
        this.behaviors = designMap.behavior;
        this.threadDebuggers = threadDebuggers;

        this.displayDebugInfo = true;

        console.log("SemanticTransformer initialized", this.behaviors, this.threadDebuggers);
        this.constructBehavior();
    }

    /**
     * Given the behaviors and thread debuggers, this function
     * extracts the behavior of the design. It follows
     * the outputs to their new inputs and continues the
     * trace to assemble the designs behavior.
     */
    constructBehavior () {
        const keys = Object.keys(this.threadDebuggers);
        const thread = this.threadDebuggers[keys[0]].thread;
        const executionTree = thread.executionTreeFull;
        const behaviorStack = [];

        let pos = 0;
        do {
            // TODO: If entry is an output, then track it to the next
            // input using UID for building behaviors across boundaries.
            const entry = executionTree[pos];

            const functionalId = entry.meta.functionalid;
            const currentBehavior = this.getBehavior(entry.meta.functionalid);

            if (!currentBehavior) {
                continue;
            }

            while (behaviorStack.length > 0) {
                const stackTop = behaviorStack[behaviorStack.length - 1];

                if (stackTop.entry.meta.behavioral_role === "selector" &&
                    stackTop.entry.meta.targetBehaviors.includes(currentBehavior.id)) {
                    // Find the stack position which selected this behavior.
                    behaviorStack.push({
                        "behavior": currentBehavior,
                        "entry": entry,
                        "position": 1,
                    });
                    break;
                } else if (stackTop.behavior.id === currentBehavior.id) {
                    // Update the pos of the behavior that is being executed.
                    const stackTop = behaviorStack[behaviorStack.length - 1];
                    const abstractions = stackTop.behavior.abstractions;
                    stackTop.behavior = currentBehavior;
                    stackTop.entry = entry;
                    stackTop.position = abstractions.indexOf(entry.meta.functionalid) + 1;
                    break;
                }
                // Remove the behavior from the stack, it is done.
                behaviorStack.pop();
            }

            // We ended up removing all the behaviors from the stack, so add
            // the current one to it as it is the behavior being exhibited.
            if (behaviorStack.length === 0) {
                behaviorStack.push({
                    "behavior": currentBehavior,
                    "entry": entry,
                    "position": 1,
                });
            }

            const isNewBehavior = (currentBehavior.abstractions[0] === functionalId);
            if (isNewBehavior) {
            }

            this.printBehavioralStack(behaviorStack);
        } while (++pos < executionTree.length);
    };

    /**
     * Prints the current behavior stack.
     * @param {Array} stack
     */
    printBehavioralStack (stack) {
        if (!this.displayDebugInfo) {
            return;
        }
        let output = "";
        for (let i = 0; i < stack.length; i++) {
            const entry = stack[i];
            const pos = entry.position;
            const total = entry.behavior.abstractions.length;
            output += `[${entry.behavior.id}(${pos}/${total})] `;
        }
        console.log(output);
    }

    /**
     * Given an id, returns the behavior that
     * this id belongs to.
     * @param {String} id
     * @return {Object}
     */
    getBehavior (id) {
        for (let i = 0; i < this.behaviors.length; i++) {
            const entry = this.behaviors[i];
            if (entry.abstractions.includes(id)) {
                return entry;
            }
        }
    }
}

export default SemanticTransformer;
