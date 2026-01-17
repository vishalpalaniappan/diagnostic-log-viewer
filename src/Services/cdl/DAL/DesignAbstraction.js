import AbstractionStep from "./AbstractionStep";
import {DESIGN, STEP} from "./DAL_CONSTANTS";
/**
 * Represents an instance of an abstraction object
 * loaded intot he abstraction stack.
 */
class DesignAbstraction {
    /**
     * Initializes the abstraction.
     * @param {Object} abstraction
     */
    constructor (abstraction) {
        this.abstraction = {...abstraction};
        this.steps = [];
        for (let i = 0; i < this.abstraction.steps.length; i++) {
            this.steps.push(new AbstractionStep(this.abstraction.steps[i]));
        }
        this.step = 0;
    }

    /**
     * Returns the current step in the design abstraction.
     * @return {Object}
     */
    getCurrentStep () {
        return this.steps[this.step];
    }

    /**
     * Tests if the abstraction is done.
     * @return {Boolean}
     */
    testDone () {
        if (this.step >= this.steps.length) {
            return true;
        }

        if (this.step === this.steps.length - 1) {
            const currentStep = this.getCurrentStep();
            if (currentStep && currentStep.step.repeat) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /**
     * Given an ID, if the next step
     * can be taken given the current state.
     * @param {String} id
     * @return {Object|null}
     */
    testNext (id) {
        while (this.step < this.steps.length) {
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
                return this.getResponse(DESIGN.GOTO_MODULE, result.args);
            } else {
                console.warn("Unknown response from step object");
                break;
            }
        };

        if (this.step >= this.steps.length) {
            return this.getResponse(DESIGN.DESIGN_ABS_DONE, null);
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
