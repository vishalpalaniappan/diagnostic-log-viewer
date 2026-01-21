import {getSimpleUID} from "../helper";
/**
 * This class contains an semantic abstraction.
 */
class SemanticAbstraction {
    /**
     * Initializes the semantic trace.
     * @param {String} atomicUid
     */
    constructor (atomicUid) {
        this.type = "atomic";
        this.atomicUid = atomicUid;
        this.uid = getSimpleUID();
        this.rootTrace = [];
        this.trace = this.rootTrace;
        this.forkStack = [];
        this.level = 1;
        this.forkStack.push({
            trace: this.trace,
            level: this.level,
        });
        this.printDebugLog = false;
    }

    /**
     * Record the entry into the trace.
     *
     * @param {Object} step
     */
    addToTrace (step) {
        step.level = this.level;
        step.position = this.trace.length;
        step.execution[0].seg.level = 0;
        step.execution[0].seg.collapsible = false;
        step.execution[0].seg.collapsed = false;

        const traceLength = this.trace.length;
        if (traceLength > 0 && this.trace[traceLength - 1].instanceUID === step.instanceUID) {
            // In the same instance, so append to execution.
            this.trace[traceLength - 1].execution.push(step.execution[0]);
        } else {
            this.trace.push(step);
        }

        // this uid is used to set keys in components and ids in DOM tree
        step.uid = getSimpleUID();

        // this uid links every step to the atomic abstraction it is part of
        // TODO: In a good design, this would be redundant, revisit this.
        step.atomicUid = this.atomicUid;

        if (step.type === "selector" || step.type === "selector_repeat") {
            this.incrementLevel();
        }
    }

    /**
     * Process the ndoes when the abstraction finishes.
     */
    processNodes () {
        let pos = 0;
        do {
            const entry = this.trace[pos];
            this.displayDebugLog(entry);
        } while (++pos < this.trace.length);
    }

    /**
     * Prints the debug log given the entry with the indentation.
     * @param {Object} entry
     */
    displayDebugLog (entry) {
        if (this.printDebugLog) {
            const spacer = "     ";
            const spacerStr = spacer.repeat(entry.level);
            console.log(spacerStr + entry.debugLog);
        }
    }

    /**
     * Increases the level by one.
     */
    incrementLevel () {
        this.level++;
    }

    /**
     * Decreases the level by one.
     */
    decrementLevel () {
        this.level--;
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
        this.forkStack.push({
            trace: this.trace,
            level: this.level,
        });
        const currNode = this.trace[this.trace.length - 1];
        currNode.fork = [];
        this.trace = currNode.fork;
        this.level = 1;
    }


    /**
     * Ends the current fork and returns the fork below
     * it on the list.
     *
     * See start fork doc for more information.
     */
    endFork () {
        this.forkStack.pop();
        const currLevel = this.forkStack[this.forkStack.length - 1];
        console.log(currLevel);
        this.trace = currLevel.trace;
        this.level = currLevel.level;
    }
}

export default SemanticAbstraction;
