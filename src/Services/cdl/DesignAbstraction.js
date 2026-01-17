import AbstractionStep from "./AbstractionStep";
import STEP_CONSTANTS from "./STEP_CONSTANTS";
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
     */
    testNext (id) {
        do {
            const currentStep = this.getCurrentStep();
            const result = currentStep.evaluateBehavior(id);

            if (result.id === STEP_CONSTANTS.BEHAVIOR_NOT_FOUND) {
                console.log("Behavior not found in step, moving onto next one.");
                this.step++;
            } else if (result.id === STEP_CONSTANTS.SAME_BEHAVIOR) {
                console.log("Same behavior, nothing to do.");
                break;
            } else if (result.id === STEP_CONSTANTS.STEP_INVALID) {
                console.log("Invalid step, major error");
                break;
            } else if (result.id === STEP_CONSTANTS.SELECT_ABSTRACTION) {
                console.log("Going to abstraction:", result.args);
                break;
            } else {
                console.warn("Unknown response from step object");
                break;
            }
        } while (this.step < this.abstraction.steps.length);
    }
}

export default DesignAbstraction;
