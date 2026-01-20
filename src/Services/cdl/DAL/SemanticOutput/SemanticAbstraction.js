/**
 * This class contains an semantic abstraction.
 */
class SemanticAbstraction {
    /**
     * Initializes the semantic trace.
     */
    constructor () {
        this.trace = [];
    }

    /**
     * Record the entry into the trace.
     *
     * This will temporarily hold the debug log
     * message and will be expanded.
     * @param {*} entry
     */
    addToTrace (entry) {
        this.trace.push(entry);
    }
}

export default SemanticAbstraction;
