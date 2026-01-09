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
        this.concurrentAbstractions = designMap?.concurrent_abstractions;
        console.log(this.behaviors);
        this.threadDebuggers = threadDebuggers;

        this.displayDebugInfo = false;
        this.behavioralTree = [];

        console.log("SemanticTransformer initialized", this.behaviors, this.threadDebuggers);
        this.threadBehaviors = {};
        const threadIds = Object.keys(this.threadDebuggers);
        threadIds.forEach((id, index) => {
            this.behavioralTree = [];
            this.constructBehavior(id);
            this.threadBehaviors[id] = this.behavioralTree;
        });
        console.log(this.threadBehaviors);
        this.findAtomic();
    }

    /**
     * Finds the atomic behaviors to begin the
     * concurrent behavior assembly.
     */
    findAtomic () {
        const threadIds = Object.keys(this.threadBehaviors);
        threadIds.forEach((id, index) => {
            const threadBehavior = this.threadBehaviors[id];
            for (let i = 0; i < threadBehavior.length; i++) {
                const entry = threadBehavior[i];
                if (entry?.behavior?.atomic) {
                    this.findConcurrentAbstraction(entry?.behavior?.id);
                }
            }
        });
    }


    /**
     * Given the atomic abstraction, this finds the concurrent abstraction
     * that it belongs to.
     * @param {Number} id
     */
    findConcurrentAbstraction (id) {
        this.concurrentAbstractions.forEach((abs, index) => {
            if (abs.start === id) {
                console.log("Found concurrent abstraction:", abs);
            }
        });
    }



    /**
     * Given a thread, this function extracts the behavior of the thread.
     * @param {String} id
     */
    constructBehavior (id) {
        const thread = this.threadDebuggers[id].thread;
        const seg = thread.seg;
        const behaviorStack = [];

        if (!seg || seg.length === 0) {
            console.warn("No execution tree found for semantic transformation.");
            return;
        }

        let pos = 0;
        do {
            const entry = seg[pos];
            const functionalId = entry.meta.functionalId;
            const currentBehavior = this.getBehavior(entry.meta.functionalId);

            if (!currentBehavior) {
                continue;
            }

            while (behaviorStack.length > 0) {
                const stackTop = behaviorStack[behaviorStack.length - 1];

                // Temporarily disabling selectors to flatten tree.
                if (false && stackTop.entry.meta.behavioral_role === "selector" &&
                    stackTop.entry.meta.targetBehaviors.includes(currentBehavior.id)) {
                    // Find the stack position which selected this behavior.
                    behaviorStack.push({
                        "behavior": currentBehavior,
                        "entry": entry,
                        "position": 1,
                    });
                    break;
                } else if (stackTop.behavior.id === currentBehavior.id) {
                    const stackTop = behaviorStack[behaviorStack.length - 1];
                    const abstractions = stackTop.behavior.abstractions;

                    const newPosition = abstractions.indexOf(entry.meta.functionalId) + 1;
                    if (newPosition >= stackTop.position) {
                        // Check if we have moved forward in the same behavior
                        stackTop.behavior = currentBehavior;
                        stackTop.entry = entry;
                        stackTop.position = abstractions.indexOf(entry.meta.functionalId) + 1;
                        break;
                    }
                }

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

            const level = behaviorStack.length;
            const isNewBehavior = (currentBehavior.abstractions[0] === functionalId);
            if (isNewBehavior) {
                // New behavior being executed, add a new entry with execution.
                this.behavioralTree.push({
                    "level": level - 1,
                    "index": this.behavioralTree.length,
                    "behavior": currentBehavior,
                    "intent": currentBehavior.intent,
                    "outputs": [],
                    "inputs": [],
                    "execution": [entry],
                });
            } else {
                // Existing behavior, append execution to last entry.
                const lastBehavior = this.behavioralTree[this.behavioralTree.length - 1];
                lastBehavior.execution.push(entry);
            }

            this.printBehavioralStack(behaviorStack);

            const latestBehavior = this.behavioralTree[this.behavioralTree.length - 1];

            /**
             * Save the output to the behavior. I work backward from the entry
             * position to the first output I find. Currently, I only have one
             * output per abstraction.
             * TODO: Extend this for multiple outputs per abstraction.
             **/
            if (entry.meta?.output) {
                const outputs = this.threadDebuggers[entry.abstraction.threadId].thread.outputs;
                let position = entry.abstraction.position;
                outerLoop: do {
                    for (let i = 0; i < outputs.length; i++) {
                        if (outputs[i].position === position) {
                            latestBehavior.outputs.push(outputs[i]);
                            break outerLoop;
                        }
                    }
                } while (--position > 0);
            };

            /**
             * Save the output to the behavior. I work backward from the entry
             * position to the first input I find. Currently, I only have one
             * input per abstraction.
             * TODO: Extend this for multiple inputs per abstraction.
             **/
            if (entry.meta?.input) {
                const thread = this.threadDebuggers[entry.abstraction.threadId].thread;
                let position = entry.abstraction.position;
                outerLoop: do {
                    for (let i = 0; i < thread.inputs.length; i++) {
                        if (thread.inputs[i].position === position) {
                            latestBehavior.inputs.push(thread.inputs[i]);
                            break outerLoop;
                        }
                    }
                } while (++position < thread.execution.length);
            }
        } while (++pos < seg.length);

        // Set the collapsible states of the tree nodes
        pos = 1;
        do {
            const prevEntry = this.behavioralTree[pos - 1];
            if (this.behavioralTree[pos].level > prevEntry.level) {
                prevEntry.collapsible = true;
                prevEntry.collapsed = false;
            } else {
                prevEntry.collapsible = false;
                prevEntry.collapsed = false;
            }
        } while (++pos < this.behavioralTree.length);

        console.log(this.behavioralTree);
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
            // output += `${entry.entry.meta.functionalId}
            // [${entry.behavior.id}(${pos}/${total})] `;
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
