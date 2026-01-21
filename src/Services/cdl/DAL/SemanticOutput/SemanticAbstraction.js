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
        this.printDebugLog = true;
    }

    /**
     * Record the entry into the trace.
     *
     * @param {Object} step
     */
    addToTrace (step) {
        step.level = this.level;
        step.position = this.trace.length;

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
            this.normalizeExecutionLevel(entry);
        } while (++pos < this.trace.length);
    }

    /**
     * Normalizes the execution level and updates the collapsible state.
     * This is because I build the SEG for the entire execution and then
     * it gets loaded with its level in that tree.
     *
     * TODO: There will be issues with traces that span multiple threads,
     * I need to revisit this and think about how this case would work.
     * It also implies that you can collapse the execution across threads,
     * this is not accurate. I think I might have to indicate that there is
     * a break in the execution to avoid all these issues but this needs to
     * be revisited.
     * @param {Object} entry
     */
    normalizeExecutionLevel (entry) {
        // Find the min level
        let minLevel;
        for (let i = 0; i < entry.execution.length; i++) {
            if (minLevel && minLevel > entry.execution[i].seg.level) {
                minLevel = entry.execution[i].seg.level;
            } else {
                minLevel = entry.execution[i].seg.level;
            }
        }
        // Offset the levels by the min level
        for (let i = 0; i < entry.execution.length; i++) {
            const seg = entry.execution[i].seg;
            seg.level = seg.level - minLevel;
        }
        // Set/update the collapsed state
        for (let i = 1; i < entry.execution.length; i++) {
            const prevNode = entry.execution[i-1].seg;
            const currNode = entry.execution[i].seg;
            if (currNode.level > prevNode.level) {
                prevNode.collapsible = true;
                prevNode.collapsed = false;
            }
            // The last entry should not be collapsible
            if (i === entry.execution.length - 1) {
                currNode.collapsible = true;
                currNode.collapsed = false;
            }
        }
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
