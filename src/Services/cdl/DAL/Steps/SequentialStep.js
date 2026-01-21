import {STEP} from "../DAL_CONSTANTS";
import {buildResponse} from "../helper";
import {SemanticTrace} from "../SemanticOutput/SemanticTrace";

/**
 * Represents a sequential step.
 */
class SequentialStep {
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
        this.name = step.name;
        this.type = "sequential";
        this.behaviorCount = 0;
        this.done = false;
    }

    /**
     * Returns the behavior being exhibited in the step.
     * @return {String|null}
     */
    getBehavior () {
        this.currentBehavior = this.step.behavior[this.behaviorCount];
        return this.currentBehavior;
    }

    /**
     * Evaluates the step given the behavior.
     * @param {Object} execution Behavior being evaluated
     * @return {Object|null}
     */
    evaluateBehavior (execution) {
        this.execution = execution;
        const behavior = execution.behavior.id;

        // Check if we are still exhibiting the same behavior in the step.
        const currBehavior = this.step.behavior[this.behaviorCount];
        if (behavior === currBehavior) {
            this.buildState(execution);
            return buildResponse(STEP.SOLVED, null);
        }

        // Increment behavior count because we have moved on to the next one
        this.behaviorCount++;

        if (this.behaviorCount < this.step.behavior.length) {
            const expectedBehavior = this.step.behavior[this.behaviorCount];
            if (expectedBehavior !== behavior) {
                console.warn("The expected behavior was not found.");
                console.warn(expectedBehavior, behavior);
                return buildResponse(STEP.ERROR, null);
            }
            this.buildState(execution);
            return buildResponse(STEP.SOLVED, null);
        } else {
            // If we have moved past the last behavior in the sequential list
            // then we are done.
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

        const behaviorCount = this.behaviorCount + 1;
        const totalBehavior = this.step.behavior.length;
        const behaviorLength = `(${behaviorCount}/${totalBehavior})`;

        const infoStr = `[${behavior}]`;
        const stepString = `(${this.index + 1}/${this.totalSteps}) of ${this.designAbsName}`;
        const state = `SOLVED step ${stepString}, behavior ${behaviorLength}: ${infoStr}`;
        this.debugLog = state;
        SemanticTrace.recordTrace({...this});
    }
}

export default SequentialStep;
