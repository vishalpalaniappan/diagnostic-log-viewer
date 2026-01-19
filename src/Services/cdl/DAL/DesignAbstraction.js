import {DESIGN, STEP} from "./DAL_CONSTANTS";
import FanoutStep from "./Steps/FanoutStep";
import SelectorRepeatStep from "./Steps/SelectorRepeatStep";
import SelectorStep from "./Steps/SelectorStep";
import SequentialStep from "./Steps/SequentialStep";
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
        this.initializeSteps();
        this.step = 0;
    }

    /**
     * Initializes the steps with the relevant object.
     */
    initializeSteps () {
        for (let i = 0; i < this.abstraction.steps.length; i++) {
            const step = this.abstraction.steps[i];
            if (step.type === "sequential") {
                this.steps.push(new SequentialStep(step, i));
            } else if (step.type === "selector") {
                this.steps.push(new SelectorStep(step, i));
            } else if (step.type === "selector_repeat") {
                this.steps.push(new SelectorRepeatStep(step, i));
            } else if (step.type === "fanout") {
                this.steps.push(new FanoutStep(step, i));
            }
        }
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
            if (this.getCurrentStep().type === "selector_repeat") {
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
     * @param {String} info
     * @return {Object|null}
     */
    testNext (info) {
        while (this.step < this.steps.length) {
            const currentStep = this.getCurrentStep();
            const result = currentStep.evaluateBehavior(info);

            // We are still in the same step, continue the design.
            if (result?.id === STEP.SAME_STEP) {
                return this.getResponse(DESIGN.CONTINUE, result.args);
            }

            // Step is done, if it was the last step, finish the abstraction.
            if (result?.id === STEP.STEP_DONE_RETRY) {
                this.step++;
                return this.getResponse(DESIGN.MOVE_DOWN_STACK_AND_TRY_AGAIN, result.args);
            }

            // Step is done, if it was the last step, finish the abstraction.
            if (result?.id === STEP.STEP_DONE) {
                this.step++;
                if (this.step >= this.steps.length) {
                    return this.getResponse(DESIGN.MOVE_DOWN_STACK_AND_RETURN, result.args);
                }
                continue;
            }

            // Go to module without moving to next step
            if (result?.id === STEP.GOTO_MODULE) {
                console.log("Going to module:", result.args.module);
                return this.getResponse(DESIGN.GOTO_MODULE, result.args);
            }

            // Go to module and increment the step
            if (result?.id === STEP.GOTO_MODULE_AND_STEP) {
                this.step++;
                console.log("Stepping and Going to module:", result.args.module);
                return this.getResponse(DESIGN.GOTO_MODULE, result.args);
            }

            // Fork the design
            if (result?.id === STEP.FORK) {
                return this.getResponse(DESIGN.FORK, result.args);
            }

            // Error in the design
            if (result?.id === STEP.ERROR) {
                console.log("ERROR");
                return this.getResponse(DESIGN.ERROR, result.args);
            }

            break;
        };
        if (this.step >= this.steps.length) {
            // console.log("Step done:", this.step, this.steps.length);
            return this.getResponse(DESIGN.DESIGN_ABS_DONE_2, null);
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
