import {STEP} from "../DAL_CONSTANTS";
import {buildResponse} from "../helper";
import {SemanticTrace} from "../SemanticOutput/SemanticTrace";
import Step from "./Step";

/**
 * Represents a fanout step in a design abstraction.
 */
class FanoutStep extends Step {
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
        this.type = "fanout";
        this.done = false;
    }

    /**
     * Evaluates the step given the abstraction.
     * @param {Object} execution
     * @return {Object|null}
     */
    evaluate (execution) {
        this.execution = [execution];
        const abstractionId = execution.abstraction.id;

        if (this.step.module === abstractionId) {
            // If the provided abstractionId is what we are fanning
            // out to, then FORK.
            this.done = true;
            this.buildState(execution);
            return buildResponse(STEP.FORK, null);
        } else {
            // If the provided abstractionId is not what we are fanning
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
        const abstraction = execution.abstraction.id;
        const infoStr = `[${abstraction}]`;
        const stepString = `(${this.currStep}/${this.totalSteps}) of ${this.designAbsName}`;
        const typeStr = "\x1b[33mFANOUT\x1b[0m";
        const state = `${typeStr} step ${stepString}: ${infoStr}`;
        this.debugLog = state;
        SemanticTrace.recordTrace({...this});
    }
}

export default FanoutStep;
