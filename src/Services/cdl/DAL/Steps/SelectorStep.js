import {STEP} from "../DAL_CONSTANTS";
/**
 * Represents a selector step.
 */
class SelectorStep {
    /**
     * Initializes the abstraction.
     * @param {Object} step
     */
    constructor (step) {
        this.step = step;
        this.type = "selector";

        this.optionTotal = step.options.length;
        this.optionCount = 0;
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

        // Check if the provided module was selected and go to the module.
        for (let i = 0; i < this.step.options.length; i++) {
            const step = this.step.options[i];
            if (step.module === behavior) {
                console.log("Found selected behavior:", behavior);
                this.done = true;
                return this.getResponse(STEP.GOTO_MODULE_AND_STEP, {module: step.module});
            }
        }

        // Inc count to indicate that we visited an option that didn't resolve.
        this.optionCount++;

        if (this.optionCount >= this.optionTotal) {
            // If we have visited all the options and it didn't resolve, then
            // this indicates an error.
            this.done = true;
            return this.getResponse(STEP.STEP_DONE, null);
        } else {
            // We still have more options to visit, so we should continue.
            return this.getResponse(STEP.SAME_STEP);
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

export default SelectorStep;
