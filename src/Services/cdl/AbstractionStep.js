import STEP_CONSTANTS from "./STEP_CONSTANTS";
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
     * Evaluates the behavior being exhibited in the step.
     * @param {Object} behavior
     * @return {Object}
     */
    evaluateBehavior (behavior) {
        if (this.type === "sequential") {
            const index = this.step.behavior.indexOf(behavior);

            if (index === -1) {
                // console.log("Behavior isn't in this curr sequential step");
                return this.getResponse(STEP_CONSTANTS.BEHAVIOR_NOT_FOUND, null);
            } else {
                if (index === this.behaviorIndex) {
                    // console.log("Same behavior in step: ", behavior);
                    return this.getResponse(STEP_CONSTANTS.SAME_BEHAVIOR, null);
                } else if (index === this.behaviorIndex + 1) {
                    // console.log("Move onto next behavior in step", behavior);
                    this.behaviorIndex = index;
                    return this.getResponse(STEP_CONSTANTS.STEP_SUCCESS, null);
                } else if (index > this.behaviorIndex + 1) {
                    // console.warn("Moved over behavior in step");
                    return this.getResponse(STEP_CONSTANTS.STEP_INVALID, null);
                }
            }
        } else if (this.type === "selector") {
            // Find the option that was selected.
            for (let i = 0; i < this.step.options.length; i++) {
                if (this.step.options[i].module === behavior) {
                    return this.getResponse(
                        STEP_CONSTANTS.SELECT_ABSTRACTION,
                        {module: this.step.options[i].module}
                    );
                }
            }
            console.warn("The selector didn't select a valid option");
        }
    }


    /**
     * Generates response to the design abstraction.
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

export default AbstractionStep;
