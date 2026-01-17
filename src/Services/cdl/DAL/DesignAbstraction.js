import AbstractionStep from "./AbstractionStep";
import {STACK, STEP} from "./DAL_CONSTANTS";
/**
 * Represents an instance of an abstraction object
 * loaded intot he abstraction stack.
 */
class DesignAbstraction {
    /**
     * Initializes the abstraction.
     * @param {Object} abstraction
     * @param {Number} step
     */
    constructor (abstraction, step) {
        this.abstraction = abstraction;
        for (let i = 0; i < this.abstraction.steps.length; i++) {
            this.abstraction.steps[i] = new AbstractionStep(
                this.abstraction.steps[i]
            );
        }
        this.step = 0;
    }

    /**
     * Returns the current step in the design abstraction.
     * @return {Object}
     */
    getCurrentStep () {
        return this.abstraction.steps[this.step];
    }

    /**
     * Given an ID, if the next step
     * can be taken given the current state.
     * @param {String} id
     * @return {Object|null}
     */
    testNext (id) {
        while (this.step < this.abstraction.steps.length) {
            const currentStep = this.getCurrentStep();
            const result = currentStep.evaluateBehavior(id);

            if (result.id === STEP.BEHAVIOR_NOT_FOUND) {
                // console.log("Behavior not found in step, moving onto next.");
                this.step++;
            } else if (result.id === STEP.SAME_BEHAVIOR) {
                // console.log("Same behavior, nothing to do.");
                break;
            } else if (result.id === STEP.STEP_INVALID) {
                console.log("Invalid step, major error");
                break;
            } else if (result.id === STEP.GOTO_MODULE) {
                // console.log("Going to abstraction:", result.args);
                this.step++;
                return this.getResponse(STACK.GOTO_MODULE, result.args);
            } else {
                console.warn("Unknown response from step object");
                break;
            }
        };

        if (this.step >= this.abstraction.steps.length) {
            return this.getResponse(STACK.DESIGN_ABS_DONE, null);
        }
    }


    /**
     * Generates response to the behavior stack object.
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

export default DesignAbstraction;
