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
        this.behavioralTree = [];

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
        let seg = thread.seg;
        const behaviorStack = [];

        if (!seg || seg.length === 0) {
            console.warn("No execution tree found for semantic transformation.");
            return;
        }

        let pos = 0;
        do {
            // TODO: If entry is an output, then track it to the next
            // input using UID for building behaviors across boundaries.
            let entry = seg[pos];

            let functionalId = entry.meta.functionalId;
            let currentBehavior = this.getBehavior(entry.meta.functionalId);

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
                    const stackTop = behaviorStack[behaviorStack.length - 1];
                    const abstractions = stackTop.behavior.abstractions;

                    const newPosition = abstractions.indexOf(entry.meta.functionalId) + 1;
                    if (newPosition >= stackTop.position) {
                        // Check if we have moved forward in the same behavior
                        stackTop.behavior = currentBehavior;
                        stackTop.entry = entry;
                        stackTop.position = abstractions.indexOf(entry.meta.functionalId) + 1;
                        break;
                    } else if (stackTop.behavior.type === "atomic" && newPosition == 1) {
                        // Within the thread, if we have returned to the start
                        // of the atomic behavior, then remove it from the stack
                        // and restore the position in the previous thread that
                        // sent it the message.
                        behaviorStack.pop();
                        const stackTop = behaviorStack[behaviorStack.length -1];
                        seg = stackTop.seg;
                        pos = stackTop.pos;
                        entry = seg[pos];
                        functionalId = entry.meta.functionalId;
                        currentBehavior = this.getBehavior(entry.meta.functionalId);
                        continue;
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
                    "execution": [entry],
                });
            } else {
                // Existing behavior, append execution to last entry.
                const lastBehavior = this.behavioralTree[this.behavioralTree.length - 1];
                lastBehavior.execution.push(entry);
            }

            this.printBehavioralStack(behaviorStack);

            if (entry.meta?.output) {
                const newState = this.trackOutput(entry);
                // console.log("Output continues at:",
                //     newState.seg[newState.pos]);
                const stackTop = behaviorStack[behaviorStack.length - 1];
                if (!stackTop?.seg) {
                    stackTop.seg = seg;
                    stackTop.pos = pos + 1;
                }

                pos = newState.pos - 1;
                seg = newState.seg;
                continue;
            }


            // Set the collapseible state of the previous entry
            // based on the current level.
            if (this.behavioralTree.length > 1) {
                const prevEntry = this.behavioralTree[this.behavioralTree.length -2];
                console.log(entry.level, prevEntry.level);
                if (entry.level > prevEntry.level) {
                    prevEntry.collapsible = true;
                    prevEntry.collapsed = false;
                } else {
                    prevEntry.collapsible = false;
                    prevEntry.collapsed = false;
                }
            }
        } while (++pos < seg.length);

        console.log(this.behavioralTree);
    };


    /**
     * Given an output, this function tracks it to an input
     * in another part of the program using the UID.
     * @param {Object} entry
     * @return {Object}
     */
    trackOutput (entry) {
        // console.log("Tracking output", entry);
        const thread = entry.abstraction.threadId;
        const position = entry.abstraction.position;

        // Get the debugger
        const threadDebugger = this.threadDebuggers[thread];
        const outputs = threadDebugger.thread.outputs;

        /**
         * TODO: This is a very simple assumption. It assumes
         * that given an output abstraction, the statement which
         * encodes the output to another part of the design is right
         * above it. This holds true for the way that I have implemented
         * the library manager, the encoded output statement is right
         * above the abstraction which sends the message to the other
         * thread. I can't rely on this, instead, I think it is better
         * to unambiguously indicate which variable this abstraction
         * is outputting and then scan backwards until you find that
         * specific output. I will return to this to fix this.
         */
        const outputPosition = position - 1;

        // Find the output
        let output;
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].position === outputPosition) {
                // console.log("Found output:", outputs[i]);
                output = outputs[i];
                break;
            }
        }

        // Output was not found, so indicate that there is a major error
        if (!output) {
            console.error("Could not find the output position, error in trace structure");
            return;
        }

        // Find the input
        const threads = Object.keys(this.threadDebuggers);
        let input;
        for (let i = 0; i < threads.length; i++) {
            const thread = threads[i];
            const threadDebugger = this.threadDebuggers[thread];
            const inputs = threadDebugger.thread.inputs;

            for (let j = 0; j < inputs.length; j++) {
                if (inputs[j].value.adliExecutionId === output.value.adliExecutionId) {
                    input = inputs[j];
                    // console.log("Found input", inputs[j]);
                    break;
                }
            }
        }

        // Input was not found, so indicate that there is a major error
        if (!input) {
            console.error("Could not find the Input position, error in trace structure");
            return;
        }

        const newSeg = this.threadDebuggers[input.value.thread].thread.seg;
        let segIndex;
        for (let i = 0; i < newSeg.length; i++) {
            if (newSeg[i].abstraction.position > input.position) {
                break;
            };
            segIndex = i;
        }

        return {
            thread: input.value.thread,
            seg: newSeg,
            pos: segIndex,
        };
    }

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
