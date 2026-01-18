import {STEP} from "./DAL_CONSTANTS";
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
            this.currentBehavior = step.behavior[this.behaviorIndex];
        }
    }

    /**
     * Returns the behavior being exhibited in the step.
     * @return {String|null}
     */
    getBehavior () {
        if (this.type === "sequential") {
            this.currentBehavior = this.step.behavior[this.behaviorIndex];
            return this.currentBehavior;
        } else if (this.type === "selector") {
            return "In Selector";
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
                return this.getResponse(STEP.BEHAVIOR_NOT_FOUND, null);
            } else {
                if (index === this.behaviorIndex) {
                    // console.log("Same behavior in step: ", behavior);
                    return this.getResponse(STEP.SAME_BEHAVIOR, null);
                } else if (index === this.behaviorIndex + 1) {
                    // console.log("Move onto next behavior in step", behavior);
                    this.behaviorIndex = index;
                    return this.getResponse(STEP.STEP_SUCCESS, null);
                } else if (index > this.behaviorIndex + 1) {
                    // console.warn("Moved over behavior in step");
                    return this.getResponse(STEP.STEP_INVALID, null);
                }
            }
        } else if (this.type === "selector") {
            // Find the option that was selected.
            for (let i = 0; i < this.step.options.length; i++) {
                if (this.step.options[i].module === behavior) {
                    return this.getResponse(
                        STEP.GOTO_MODULE,
                        {module: this.step.options[i].module}
                    );
                }
            }
            // console.warn("The selector didn't select a valid option");
            return this.getResponse(STEP.BEHAVIOR_NOT_FOUND, null);
        } else if (this.type === "fanout") {
            return this.getResponse(STEP.FORK, null);
        } else if (this.type === "join") {
            return this.getResponse(STEP.JOIN, null);
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
