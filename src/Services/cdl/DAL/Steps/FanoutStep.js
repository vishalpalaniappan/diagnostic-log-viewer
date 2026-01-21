import {STEP} from "../DAL_CONSTANTS";
import {buildResponse} from "../helper";
import {SemanticTrace} from "../SemanticOutput/SemanticTrace";

/**
 * Represents a fanout step in a design abstraction.
 */
class FanoutStep {
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
        this.type = "fanout";
        this.done = false;
    }

    /**
     * Evaluates the step given the behavior.
     * @param {Object} execution
     * @return {Object|null}
     */
    evaluateBehavior (execution) {
        this.execution = execution;
        const behavior = execution.behavior.id;

        if (this.step.module === behavior) {
            // If the provided behavior is what we are fanning
            // out to, then FORK.
            this.done = true;
            this.buildState(execution);
            return buildResponse(STEP.FORK, null);
        } else {
            // If the provided behavior is not what we are fanning
            // out to, then this step is done.
            this.done = true;
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
        const stepString = `(${this.index + 1}/${this.totalSteps}) of ${this.designAbsName}`;
        const typeStr = "\x1b[33mFANOUT\x1b[0m";
        const state = `${typeStr} step ${stepString}: ${infoStr}`;
        this.debugLog = state;
        SemanticTrace.recordTrace({...this});
    }
}

export default FanoutStep;
