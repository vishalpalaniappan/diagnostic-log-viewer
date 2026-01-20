import {DESIGN, STEP} from "./DAL_CONSTANTS";
import {buildResponse} from "./helper";
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
            const totalSteps = this.abstraction.steps.length;
            if (step.type === "sequential") {
                this.steps.push(new SequentialStep(step, i, totalSteps, this.name));
            } else if (step.type === "selector") {
                this.steps.push(new SelectorStep(step, i, totalSteps, this.name));
            } else if (step.type === "selector_repeat") {
                this.steps.push(new SelectorRepeatStep(step, i, totalSteps, this.name));
            } else if (step.type === "fanout") {
                this.steps.push(new FanoutStep(step, i, totalSteps, this.name));
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
     * Given the behavioral ID, check if the next step
     * can be taken given the current state.
     *
     * The info argument contains the behavioral id but it
     * also includes the functional id in the behvior and the
     * variable stack of the position (will be used to build
     * behavioral sentences).
     *
     * If it can't, then move to the next step
     * in the design abstraction. If the next
     * step can't resolve it, then move down the
     * abstraction stack until you find the abstraction
     * that can solve it.
     *
     * The design provides a defined path forward.
     * If the observed execution position is not what
     * the design expected given the current state,
     * then we have run into an error in the instrumentation
     * and the user is notified precisely where this gap is.
     * @param {String} execution
     * @return {Object|null}
     */
    testNext (execution) {
        while (this.step < this.steps.length) {
            const currentStep = this.getCurrentStep();
            const result = currentStep.evaluateBehavior(execution);

            // Step was solved, move onto the next execution.
            if (result?.id === STEP.SOLVED) {
                return buildResponse(DESIGN.CONTINUE, result.args);
            }

            // We are still in the same step, move onto the next execution.
            if (result?.id === STEP.SAME_STEP) {
                return buildResponse(DESIGN.CONTINUE, result.args);
            }

            // Step is done, let the stack know so that it can remove it
            // from the stack if it is done and continue.
            if (result?.id === STEP.STEP_DONE) {
                this.step++;
                return buildResponse(DESIGN.STEP_DONE, result.args);
            }

            // Go to module without moving to next step
            if (result?.id === STEP.GOTO_MODULE_FROM_REPEATED_SELECTOR) {
                // Selector module picked this behavior and it repeats
                // until the it picks different behavior.
                // So we need to go back to the sequential abstraction
                // which defines the selector module until it finishes
                // by not selecting a valid behavior.
                this.step--;
                this.getCurrentStep().behaviorCount = 0;
                return buildResponse(DESIGN.GOTO_MODULE, result.args);
            }

            // Go to module and increment the step
            if (result?.id === STEP.GOTO_MODULE_AND_STEP) {
                this.step++;
                return buildResponse(DESIGN.GOTO_MODULE, result.args);
            }

            // Fork the design
            if (result?.id === STEP.FORK) {
                return buildResponse(DESIGN.FORK, result.args);
            }

            // Error in the instrumentation
            if (result?.id === STEP.ERROR) {
                return buildResponse(DESIGN.ERROR, result.args);
            }

            break;
        };
    }
}

export default DesignAbstraction;
