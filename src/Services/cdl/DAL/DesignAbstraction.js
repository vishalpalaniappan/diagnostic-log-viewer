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
        this.name = this.abstraction.name;
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
     * Tests if the abstraction is done. If the final
     * step is a repeated selector, then the abstraction
     * isn't done until an invalid module is selected
     * for the selector module.
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

            if (result?.id === STEP.BEHAVIOR_NOT_FOUND_IN_STEP) {
                // Step said that it didn't exhibit the behavior. So we move
                // onto the next step and check if it exhibits this behavior.
                this.step++;
            } else if (result?.id === STEP.SAME_STEP) {
                // Step said that the  the behavior is part of the same
                // step in the design abstraction, so we don't do anything
                // and break.
                return this.getResponse(DESIGN.CONTINUE, null);
            } else if (result?.id === STEP.STEP_DONE) {
                // Step said that based on the exhibted behavior, the current
                // step is done. So we need to actually move onto the next
                // step and check.
                this.step++;
            } else if (result?.id === STEP.GOTO_MODULE) {
                // Step said to go to this module based on the behavior
                // that was exhibited.
                return this.getResponse(DESIGN.GOTO_MODULE, result.args);
            } else if (result?.id === STEP.FORK) {
                // The current step is of fanout type, so we need to fork
                // at the current step.
                this.step++;
                return this.getResponse(DESIGN.FORK, result.args);
            } else if (result?.id === STEP.JOIN) {
                // Not implemented yet.
                this.step++;
                return this.getResponse(DESIGN.JOIN, result.args);
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
