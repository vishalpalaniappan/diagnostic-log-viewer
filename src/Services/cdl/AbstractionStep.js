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

        if (this.type === "sequential") {
            this.currentBehavior = this.step.behavior[this.behaviorIndex];
        }
    }

    /**
     * Evaluates the behavior being exhibited
     * in the step.
     * @param {Object} behavior
     */
    evaluateBehavior (behavior) {
        if (this.type === "sequential") {
            const index = this.step.behavior.indexOf(behavior);

            if (index === -1) {
                console.log("Behavior isn't in this current sequential step");
            } else {
                if (index === this.behaviorIndex) {
                    console.log("Same behavior in step: ", behavior);
                } else if (index === this.behaviorIndex + 1) {
                    console.log("Moved onto next behavior in step", behavior);
                } else if (index > this.behaviorIndex + 1) {
                    console.warn("Moved over behavior in step");
                }
            }
        }
    }
}

export default AbstractionStep;
