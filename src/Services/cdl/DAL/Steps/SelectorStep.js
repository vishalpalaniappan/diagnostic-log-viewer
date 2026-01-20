import {STEP} from "../DAL_CONSTANTS";
/**
 * Represents a selector step.
 */
class SelectorStep {
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

        // Check if the provided module was selected and go to the module.
        for (let i = 0; i < this.step.options.length; i++) {
            const step = this.step.options[i];
            if (step.module === behavior) {
                this.done = true;
                console.log(`     > MOVING to module ${behavior} in step ${this.index}: ${behavior}, ${functional}`);
                return this.getResponse(STEP.GOTO_MODULE_AND_STEP, {module: step.module});
            }
        }

        this.done = true;
        return this.getResponse(STEP.STEP_DONE, null);
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
