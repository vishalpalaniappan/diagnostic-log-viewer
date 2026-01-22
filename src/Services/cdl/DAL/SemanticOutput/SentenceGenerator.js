/**
 * Given an atomic abstraction, this class generates sentences
 * that describes what happend in it.
 */
class SentenceGenerator {
    /**
     * Initialize the semantic generator with the trace
     * and the design info.
     * @param {Array} trace
     * @param {Object} design
     */
    constructor (trace, design) {
        this.trace = trace;
        this.design = design;
        console.log("Initialized Sentence Generator");
    }
}

export default SentenceGenerator;
