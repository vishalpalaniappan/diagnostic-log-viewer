/**
 * This class contains an semantic abstraction.
 */
class SemanticAbstraction {
    /**
     * Initializes the semantic trace.
     */
    constructor () {
        this.rootTrace = [];
        this.trace = this.rootTrace;
        this.forkStack = [this.rootTrace];
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


    /**
     * Fork from the current trace. Add the current
     * trace to the fork stack so that if we fork from
     * a fork, we can still preserve the structure.
     */
    startFork () {
        this.forkStack.push(this.trace);
        const currNode = this.trace[this.trace.length - 1];
        currNode.fork = [];
        this.trace = currNode.fork;
        console.log(currNode);
    }


    /**
     * Ends the current fork and returns the fork below
     * it on the list.
     */
    endFork () {
        this.forkStack.pop();
        this.trace = this.forkStack[this.forkStack.length - 1];
    }
}

export default SemanticAbstraction;
