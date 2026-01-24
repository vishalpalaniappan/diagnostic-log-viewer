import {getSimpleUID} from "../helper";
import Behavior from "./Behavior";
import SentenceGenerator from "./SentenceGenerator";
/**
 * This class contains an semantic abstraction.
 */
class SemanticAbstraction {
    /**
     * Initializes the semantic trace.
     * @param {String} atomicUid
     * @param {Object} DALSpec
     */
    constructor (atomicUid, DALSpec) {
        this.type = "atomic";
        this.atomicUid = atomicUid;
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
     * Process the ndoes when the abstraction finishes.
     */
    processNodes () {
        let pos = 0;
        do {
            const entry = this.trace[pos];
            this.displayDebugLog(entry);
            entry.state = this.processBehavior(entry);
        } while (++pos < this.trace.length);
        // new SentenceGenerator(this.trace, this.design);
        console.log(this.trace);
    }

    /**
     * Group the execution of each step into their behaviors to extract
     * the relevant state variables so the design abstraction can use it.
     *
     * This means that the design abstraction will be defined entirely
     * through the behaviors and its state variables. This is a very
     * clean separation and the design specification will survive
     * any changes to the implementation as it is fully defined in a
     * separate abstraction.
     *
     * TODO: In each step, there is now a behavior and execution key.
     * The execution is just a list of all the executions in the step
     * and the behavior is a list of all the behaviors with the executions
     * which define it. I am keeping the execution for now because the UI
     * uses it but I will be restructing things to use the behavior list.
     * So when a step is selected, you will have the behaviors in the step
     * and then by selecting a behavior you can see the execution.
     *
     * @param {Object} entry
     * @return {Object}
     */
    processBehavior (entry) {
        /**
         * TODO: Selector types will have a state variable and that is the
         * option that was selected. I haven't yet decided how I am going to
         * formalize this. Right now, when performing the transformation,
         * in SelectorStep.js, I save the selected option in the selectedValue
         * key of the step. So entry.selectedValue will have the option that
         * was selected and this is the value of the state variable of the
         * selector step.
         *
         * TODO: If this selectedValue key is undefined, then it means the
         * selector didn't resolve to an option. This is fine, in some cases
         * where the selector isn't mutually exclusive. It tells us that this
         * step didn't select new behavior. However, right now, I don't add
         * the selector to the design trace unless it selects new behavior.
         * I might want to change this in the future.
         */
        if (entry.type === "selector") {
            return;
        }


        const behaviors = [];
        let currBehavior;
        for (let i = 0; i < entry.execution.length; i++) {
            const entryBehavior = entry.execution[i].behavior.id;
            if (currBehavior && currBehavior?.behaviorInfo.id === entryBehavior) {
                currBehavior.addExecution(entry.execution[i]);
            } else {
                const behaviorInfo = this.getBehaviorInfo(entryBehavior);
                currBehavior = new Behavior(behaviorInfo);
                currBehavior.addExecution(entry.execution[i]);
                behaviors.push(currBehavior);
            }
        }
        entry.behaviors = behaviors;
        const state = {};
        for (let i = 0; i < behaviors.length; i++) {
            behaviors[i].evaluateState();
            Object.assign(state, behaviors[i].stateVariables);
        }
        return state;
    }


    /**
     * Get the behavior info.
     * @param {String} behaviorId
     * @return {Object|null}
     */
    getBehaviorInfo (behaviorId) {
        for (let i = 0; i < this.behaviorsInDesign.length; i++) {
            if (this.behaviorsInDesign[i].id === behaviorId) {
                return this.behaviorsInDesign[i];
            }
        };
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

export default SemanticAbstraction;
