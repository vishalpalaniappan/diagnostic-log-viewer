
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
        let pos = 0;

        do {
            const entry = executionTree[pos];
            const abstractionId = entry.meta.functionalid;
            const behavior = this.getBehavior(abstractionId);

            if (behavior) {
                console.log(behavior.id);
            }
        } while (++pos < executionTree.length);

        console.log(thread);
    };

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
