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
     * @param {Object} step
     */
    addToTrace (step) {
        this.trace.push(step);
    }


    /**
     * Fork from the current trace.
     *
     * When we reach a fanout node, a fork will be started.
     * The existing trace will be added to the stack, then
     * when the fork is done, it will be removed from the
     * stack and we will return to the top of the stack.
     *
     * This means that the fork will be contained in the
     * fanout step of the design abstraction (which is what
     * resulted in the fork in the first place).
     * 
     * TODO: This needs to be extended so that if a single
     * fanout step forks to multiple positions, then I need
     * to be able to add multiple forks to a single step.
     */
    startFork () {
        this.forkStack.push(this.trace);
        const currNode = this.trace[this.trace.length - 1];
        currNode.fork = [];
        this.trace = currNode.fork;
    }


    /**
     * Ends the current fork and returns the fork below
     * it on the list.
     *
     * See start fork doc for more information.
     */
    endFork () {
        this.forkStack.pop();
        this.trace = this.forkStack[this.forkStack.length - 1];
    }
}

export default SemanticAbstraction;
