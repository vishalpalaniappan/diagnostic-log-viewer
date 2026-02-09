import {STEP} from "../DAL_CONSTANTS";
import {buildResponse} from "../helper";
import {SemanticTrace} from "../SemanticOutput/SemanticTrace";
import Step from "./Step";

/**
 * Represents a selector step.
 */
class SelectorStep extends Step {
    /**
     * Initializes the abstraction.
     * @param {Object} step
     * @param {Object} currStep
     * @param {Object} totalSteps
     * @param {Object} absName
     * @param {Object} absUid
     */
    constructor (step, currStep, totalSteps, absName, absUid) {
        super();
        this.designAbsName = absName;
        this.designAbsUid = absUid;
        this.step = step;
        this.totalSteps = totalSteps;
        this.currStep = currStep;
        this.type = "selector";
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

        // Check if the provided module was selected and go to the module.
        for (let i = 0; i < this.step.options.length; i++) {
            const option = this.step.options[i];
            if (option.behavior === behavior) {
                this.done = true;
                this.selectedValue = option.id;
                this.buildState(execution);
                return buildResponse(STEP.GOTO_MODULE, {module: option.behavior});
            }
        }

        if (this.step.mutex) {
            /**
             * The selector had to pick from one of the options but
             * but the execution didn't, this indicates an error in
             * the instrumentation. The design cannot solve the
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
        const typeStr = "\x1b[36m[SELECTED]\x1b[0m";
        const stepString = `(${this.currStep}/${this.totalSteps}) of ${this.designAbsName}`;
        const state = `${typeStr} step ${stepString}, selected module ${behavior}: ${infoStr}`;
        this.debugLog = state;
        SemanticTrace.recordTrace({...this});
    }
}

export default SelectorStep;
