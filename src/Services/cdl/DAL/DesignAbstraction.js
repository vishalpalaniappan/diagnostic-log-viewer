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
     * Given an ID, if the next step
     * can be taken given the current state.
     * @param {String} info
     * @return {Object|null}
     */
    testNext (info) {
        while (this.step < this.steps.length) {
            const currentStep = this.getCurrentStep();
            const result = currentStep.evaluateBehavior(info);

            // Step was solved, move onto the next execution.
            if (result?.id === STEP.SOLVED) {
                return this.getResponse(DESIGN.CONTINUE, result.args);
            }

            // We are still in the same step, move onto the next execution.
            if (result?.id === STEP.SAME_STEP) {
                return this.getResponse(DESIGN.CONTINUE, result.args);
            }

            // Step is done, let the stack know so that it can remove it
            // from the stack if it is done and continue.
            if (result?.id === STEP.STEP_DONE) {
                this.step++;
                return this.getResponse(DESIGN.STEP_DONE, result.args);
            }

            // Go to module without moving to next step
            if (result?.id === STEP.GOTO_MODULE_FROM_REPEATED_SELECTOR) {
                // Selector module picked this behavior and it repeats
                // So we need to go back to the sequential abstraction
                // which picks the selector module until it finishes
                // by not selecting a valid behavior.
                this.step--;
                this.getCurrentStep().behaviorCount = 0;
                return this.getResponse(DESIGN.GOTO_MODULE, result.args);
            }

            // Go to module and increment the step
            if (result?.id === STEP.GOTO_MODULE_AND_STEP) {
                this.step++;
                return this.getResponse(DESIGN.GOTO_MODULE, result.args);
            }

            // Fork the design
            if (result?.id === STEP.FORK) {
                return this.getResponse(DESIGN.FORK, result.args);
            }

            // Error in the design
            if (result?.id === STEP.ERROR) {
                return this.getResponse(DESIGN.ERROR, result.args);
            }

            break;
        };
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
