/**
 * Represents a step in the design abstraction.
 */
class AbstractionStep {
    /**
     * Initializes the abstraction.
     * @param {Object} step
     */
    constructor (step) {
        this.step = step;
        this.type = step.type;
        this.behaviorIndex = 0;

        if (this.type !== "selector") {
            this.currentBehavior = step.behavior[this.behaviorIndex];
        }
    }

    /**
     * Evaluates the behavior being exhibited
     * in the step.
     * @param {Object} behavior
     */
    evaluateBehavior (behavior) {
        if (behavior === this.currentBehavior) {
            console.log("Same behavior in step: ", behavior);
            return;
        }
    }
}

export default AbstractionStep;
