
/**
 * This class is responsible for performing the semantic transformation
 * on the threads to observe the behavior of the design.
 */
class SemanticTransformer {
    /**
     * Initializes the semantic transformer.
     * @param {Object} behaviors
     * @param {Object} threads
     */
    constructor (behaviors, threads) {
        this.behaviors = behaviors;
        this.threads = threads;
    }

    /**
     * Given the behaviors and threads, this function
     * extracts the behavior of the design. It follows
     * the outputs to their new inputs and continues the
     * trace to assemble the designs behavior.
     */
    constructBehavior () {

    };
}

export default SemanticTransformer;
