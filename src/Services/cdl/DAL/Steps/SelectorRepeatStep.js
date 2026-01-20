import {STEP} from "../DAL_CONSTANTS";
import {buildResponse} from "../helper";
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
                return buildResponse(
                    STEP.GOTO_MODULE_FROM_REPEATED_SELECTOR, {module: behavior}
                );
            }
        }

        if (this.step.mutex) {
            /**
             * The selector had to pick from one of the options but
             * but the execution didn't, this indicates an error in
             * the instrumentation.The design cannot solve the
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
}

export default SelectorRepeatStep;
