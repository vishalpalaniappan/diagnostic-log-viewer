import {DESIGN, STEP} from "./DAL_CONSTANTS";
import {getSimpleUID} from "./helper";
import {buildResponse} from "./helper";
import FanoutStep from "./Steps/FanoutStep";
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
        // UID used to uniquely identify this abstraction
        this.uid = getSimpleUID();
    }

    /**
     * Initializes the steps with the relevant object.
     */
    initializeSteps () {
        for (let currStep = 0; currStep < this.abstraction.steps.length; currStep++) {
            const step = this.abstraction.steps[currStep];
            const totalSteps = this.abstraction.steps.length;
            if (step.type === "sequential") {
                this.steps.push(
                    new SequentialStep(step, currStep + 1, totalSteps, this)
                );
            } else if (step.type === "selector") {
                this.steps.push(
                    new SelectorStep(step, currStep + 1, totalSteps, this.abstraction.id)
                );
            } else if (step.type === "fanout") {
                this.steps.push(
                    new FanoutStep(step, currStep + 1, totalSteps, this.abstraction.id)
                );
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

            // Go to module and increment the step
            if (result?.id === STEP.GOTO_MODULE) {
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

            // Go to the specified module and step by moving down
            // the stack until it is found.
            if (result?.id === STEP.GOT_MODULE_AND_STEP_IN_STACK) {
                return buildResponse(DESIGN.GOT_MODULE_AND_STEP_IN_STACK, result.args);
            }

            break;
        };
    }
}

export default DesignAbstraction;
