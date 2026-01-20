import {STEP} from "../DAL_CONSTANTS";
/**
 * Represents a sequential step.
 */
class SequentialStep {
    /**
     * Initializes the abstraction.
     * @param {Object} step
     * @param {Object} index
     */
    constructor (step, index) {
        this.step = step;
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
     * @param {Object} info Behavior being evaluated
     * @return {Object|null}
     */
    evaluateBehavior (info) {
        const behavior = info.behavioralId;
        const functional = info.functionalId;

        console.log(`     EVALUATING ${this.step.id} ${this.behaviorCount} in step ${this.index}: ${behavior}, ${functional}`);

        // Check if we are still exhibiting the same behavior in the step.
        const currBehavior = this.step.behavior[this.behaviorCount];
        if (behavior === currBehavior) {
            console.log(`     SOLVED ${this.step.id} ${this.behaviorCount} in step ${this.index}: ${behavior}, ${functional}`);
            // console.log(`${this.behaviorCount} in step ${this.index}: ${behavior}, ${functional}`);
            return this.getResponse(STEP.SOLVED, null);
        }

        // Increment behavior count because we have moved on to the next one
        this.behaviorCount++;

        if (this.behaviorCount < this.step.behavior.length) {
            console.log(`     SOLVED ${this.step.id} ${this.behaviorCount} in step ${this.index}: ${behavior}, ${functional}`);
            // console.log(`${this.behaviorCount} in step ${this.index}: ${behavior}, ${functional}`);
            const expectedBehavior = this.step.behavior[this.behaviorCount];
            if (expectedBehavior !== behavior) {
                console.warn("The expected behavior was not found.");
                return this.getResponse(STEP.ERROR, null);
            }
            return this.getResponse(STEP.SOLVED, null);
        } else {
            // If we have moved past the last behavior in the sequential list
            // then we are done.
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

export default SequentialStep;
