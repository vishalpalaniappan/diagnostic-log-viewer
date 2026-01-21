import {STEP} from "../DAL_CONSTANTS";
import {buildResponse} from "../helper";
import {SemanticTrace} from "../SemanticOutput/SemanticTrace";

/**
 * Represents a selector repeat step.
 */
class SelectorRepeatStep {
    /**
     * Initializes the abstraction.
     * @param {Object} step
     * @param {Object} index
     * @param {Object} totalSteps
     * @param {Object} designAbsName
     */
    constructor (step, index, totalSteps, designAbsName) {
        this.designAbsName = designAbsName;
        this.step = step;
        this.totalSteps = totalSteps;
        this.index = index;
        this.type = "selector_repeat";

        this.optionTotal = step.options.length;
        this.optionCount = 0;
        this.done = false;
    }

    /**
     * Evaluates the step given the behavior.
     * @param {Object} execution
     * @return {Object|null}
     */
    evaluateBehavior (execution) {
        this.execution = [execution];
        const behavior = execution.behavior.id;

        for (let i = 0; i < this.step.options.length; i++) {
            const step = this.step.options[i];
            if (step.module === behavior) {
                this.buildState(execution);
                this.done = false;
                return buildResponse(
                    STEP.GOTO_MODULE_FROM_REPEATED_SELECTOR, {module: behavior}
                );
            }
        }

        if (this.step.mutex) {
            /**
             * The selector had to pick from one of the options but
             * but the execution didn't, this indicates an error in
             * the instrumentation.The design cannot solve the
             * execution that it is observing.
             **/
            return buildResponse(STEP.ERROR, null);
        } else {
            /**
             * The selector didn't pick from one of the options, so
             * we move onto the next step and evaluate the position.
             **/
            return buildResponse(STEP.STEP_DONE, null);
        }
    }

    /**
     * Builds the current state of the step.
     * @param {Object} execution
     */
    buildState (execution) {
        const behavior = execution.behavior.id;
        const infoStr = `[${behavior}]`;
        const typeStr = "\x1b[36m[SELECTED (REPEAT)]\x1b[0m";
        const stepString = `(${this.index + 1}/${this.totalSteps}) of ${this.designAbsName}`;
        const state = `${typeStr} step ${stepString}, selected module ${behavior}: ${infoStr}`;
        this.debugLog = state;
        SemanticTrace.recordTrace({...this});
    }
}

export default SelectorRepeatStep;
