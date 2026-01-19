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
                // The behavior doesn't exist in this step, so we indicate
                // that it is not found. This means that we should move onto
                // the next step in the design abstraction and check.
                return this.getResponse(STEP.BEHAVIOR_NOT_FOUND_IN_STEP, null);
            } else if (index < this.behaviorIndex) {
                // We've moved back to an earlier behavior in this
                // step, so we are done the step.
                return this.getResponse(STEP.STEP_DONE, null);
            } else {
                // The behavior is in this step, so we are still exhibting
                // the same step in the design abstraction.
                this.behaviorIndex = index;
                return this.getResponse(STEP.SAME_STEP, null);
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
            return this.getResponse(STEP.BEHAVIOR_NOT_FOUND_IN_STEP, null);
        } else if (this.type === "fanout") {
            if (this.step.module === behavior) {
                // If the provided behavior is what we are fanning
                // out to, then FORK.
                return this.getResponse(STEP.FORK, null);
            } else {
                // If the provided behavior is not what we are fanning
                // out to, then this step is done.
                return this.getResponse(STEP.STEP_DONE, null);
            }
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
