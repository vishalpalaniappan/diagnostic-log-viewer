import {STEP} from "../DAL_CONSTANTS";
/**
 * Represents a selector repeat step.
 */
class SelectorRepeatStep {
    /**
     * Initializes the abstraction.
     * @param {Object} step
     * @param {Object} index
     */
    constructor (step, index) {
        this.step = step;
        this.index = index;
        this.type = "selector_repeat";

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


        for (let i = 0; i < this.step.options.length; i++) {
            const step = this.step.options[i];
            if (step.module === behavior) {
                console.log(`     > MOVING (REPEAT) to module ${behavior} in step ${this.index}: ${behavior}, ${functional}`);
                this.done = false;
                return this.getResponse(
                    STEP.GOTO_MODULE_FROM_REPEATED_SELECTOR, {module: behavior}
                );
            }
        }
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

export default SelectorRepeatStep;
