import {getSimpleUID} from "../helper";
import SemanticAbstraction from "./SemanticAbstraction";
/**
 * This class contains an atomic semantic abstraction.
 */
class AtomicSemanticAbstraction {
    /**
     * Initializes the semantic trace.
     * @param {String} atomicUid
     * @param {Object} DALSpec
     */
    constructor (atomicUid, DALSpec) {
        this.type = "atomic";
        this.atomicUid = atomicUid;
        this.DALSpec = DALSpec;
        this.design = DALSpec.design;
        this.behaviorsInDesign = DALSpec.behavior;
        this.uid = getSimpleUID();
        this.rootTrace = [];
        this.trace = this.rootTrace;
        this.forkStack = [];
        this.level = 1;
        this.state = [];
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
            // In the same instance, so append to execution
            const lastStep = this.trace[traceLength - 1];
            lastStep.execution.push(step.execution[0]);
        } else {
            this.trace.push(step);
            this.trace[this.trace.length - 1].exceptions = [];
            this.trace[this.trace.length - 1].violations = [];
        }

        // Add the exceptions and violations to current step in the trace.
        const currentStep = this.trace[this.trace.length - 1];
        if (step.execution[0]?.seg?.exception) {
            const exception = step.execution[0].seg.exception;
            currentStep.exceptions.push(exception);
        } else if (step.execution[0]?.seg?.violations) {
            const violations = step.execution[0].seg.violations;
            currentStep.violations = currentStep.violations.concat(violations);
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
     * Process the steps when the abstraction finishes.
     *
     * This builds the semantic abstraction tree from the trace. This
     * defines the heirarchy of the abstractions established through
     * the selections made by the design.
     *
     * This also processes each step to extract the behaviors and
     * their state variables. These state variables will define the
     * state of the design abstraction at each step.
     *
     * Since each design abstraction is unambiguous and defined, the
     * state variables will fully define the behavior of the design
     * and the behavior moves up the abstraction tree until the behavior
     * of the atomic abstraction is fully defined.
     */
    processSteps () {
        if (this.trace.length === 0) {
            return;
        }

        // Add the root abstraction
        let pos = 0;
        this.traceRoot = new SemanticAbstraction(this.trace[pos], this.DALSpec);
        this.traceRoot.addStep(this.trace[pos]);

        // Process each entry and create the abstraction tree.
        const stack = [this.traceRoot];
        while (++pos < this.trace.length) {
            const entry = this.trace[pos];
            this.displayDebugLog(entry);

            // Adjust the stack and add the step to the correct abstraction.
            if (entry.level > stack.length) {
                const abs = new SemanticAbstraction(entry, this.DALSpec);
                stack[stack.length - 1].addSelection(abs);
                stack.push(abs);
            } else if (entry.level < stack.length) {
                while (entry.level < stack.length && stack.length > 0) {
                    stack.pop();
                }
            }
            stack[stack.length - 1].addStep(entry);
        };

        console.log(this.traceRoot);
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
        this.trace = currLevel.trace;
        this.level = currLevel.level;
    }
}

export default AtomicSemanticAbstraction;
