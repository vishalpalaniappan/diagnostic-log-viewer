import {STEP} from "../DAL_CONSTANTS";
/**
 * Represents a sequential step.
 */
class SequentialStep {
    /**
     * Initializes the abstraction.
     * @param {Object} step
     */
    constructor (step) {
        this.step = step;
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
     * @param {Object} info Behavior being evaluated
     * @return {Object|null}
     */
    evaluateBehavior (info) {
        const behavior = info.behavioralId;
        const functional = info.functionalId;

        // Check if we are still exhibiting the same behavior in the step.
        const currBehavior = this.step.behavior[this.behaviorCount];
        if (behavior === currBehavior) {
            if (this.behaviorCount === 0) {
                console.log("Exhibiting first behavior in step:", behavior, functional);
            } else {
                console.log("Exhibiting the same behavior in step:", behavior, functional);
            }
            return this.getResponse(STEP.SAME_STEP, null);
        }

        // Increment behavior count because we have moved on to the next one
        this.behaviorCount++;

        if (this.behaviorCount >= this.step.behavior.length) {
            // If we have moved past the last behavior in the sequential list
            // then we are done.
            this.done = true;
            return this.getResponse(STEP.STEP_DONE, null);
        } else {
            console.log("Exhibiting new behavior in step:", behavior, functional);
            // If we are in a new behavior in this sequential list, then we are
            // still in the same step.
            return this.getResponse(STEP.SAME_STEP, null);
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

export default SequentialStep;
