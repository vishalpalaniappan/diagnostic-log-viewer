import AbstractionStep from "./AbstractionStep";
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
    constructor(abstraction, step) {
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
        const currentStep = this.getCurrentStep();
        currentStep.evaluateBehavior(id);
    }
}

export default DesignAbstraction;
