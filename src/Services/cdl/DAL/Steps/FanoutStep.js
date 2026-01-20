import {STEP} from "../DAL_CONSTANTS";
/**
 * Represents a fanout step in a design abstraction.
 */
class FanoutStep {
    /**
     * Initializes the abstraction.
     * @param {Object} step
     * @param {Object} index
     */
    constructor (step, index) {
        this.step = step;
        this.index = index;
        this.type = "selector";
        this.done = false;
    }

    /**
     * Evaluates the step given the behavior.
     * @param {Object} info
     * @return {Object|null}
     */
    evaluateBehavior (info) {
        const behavior = info.behavioralId;
        const functional = info.functionalId;

        if (this.step.module === behavior) {
            // If the provided behavior is what we are fanning
            // out to, then FORK.
            this.done = true;
            console.log(`     FANOUT ${this.step.id} ${this.behaviorCount} in step ${this.index}: ${behavior}, ${functional}`);
            return this.getResponse(STEP.FORK, null);
        } else {
            // If the provided behavior is not what we are fanning
            // out to, then this step is done.
            this.done = true;
            return this.getResponse(STEP.STEP_DONE, null);
        }
    }

    /**
     * Generates response to the design abstraction.
     * @param {String} id
     * @param {Object} args
     * @return {Object}
     */
    getResponse (id, args) {
        return {
            "id": id,
            "args": args,
        };
    }
}

export default FanoutStep;
