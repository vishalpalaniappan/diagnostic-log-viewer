import {getSimpleUID} from "../helper";
/**
 * Base step object.
 */
class Step {
    /**
     * Initialize the object with a simple uid.
     */
    constructor () {
        // This is a UID that identifies the step in the
        // design abstraction uniquely.
        this.instanceUID = getSimpleUID();
    }

    /**
     * Resets the state of the step.
     */
    reset () {
        if (this.step.type === "sequential") {
            this.behaviorCount = 0;
        }
        this.done = false;
    }

    /**
     * Get the place holder values for this step.
     * @return {Object}
     */
    getPlaceHolders () {
        const values = {};
        if (this.step.type === "selector" && this.step?.placeholders) {
            const placeholder = this.step.placeholders[0].placeholder;
            values[placeholder] = this.selectedValue;
        }

        if (this.step.type === "sequential" && this.step?.placeholders) {
            for (let i = 0; i < this.allExecutionsInStep.length; i++) {
                const exec = this.allExecutionsInStep[i];
                const execValues = this.processExecWithPlaceholders(exec);
                Object.assign(values, execValues);
            }
        }
        return values;
    }

    /**
     * Process the execution position to see if it matches
     * the placeholders we are evaluating.
     *
     * TODO: Remove placeholders from the list as they are
     * processed to reduce the number of times its evaluated.
     * @param {Object} exec
     * @return {Object}
     */
    processExecWithPlaceholders (exec) {
        const values = {};
        for (let j = 0; j < this.step.placeholders.length; j++) {
            const entry = this.step.placeholders[j];

            if (entry.type === "variable_in_behavior") {
                const execBehavior = exec.behavior.id;
                const execFunctionalId = exec.functionalId;
                if (entry.behavior === execBehavior && entry.functionalid === execFunctionalId) {
                    const placeholder = entry.placeholder;
                    if (entry.name in exec.varStack[0]) {
                        if ("key" in entry) {
                            values[placeholder] = exec.varStack[0][entry.name][entry.key];
                        } else {
                            values[placeholder] = exec.varStack[0][entry.name];
                        }
                    }
                }
            }
        }
        return values;
    }
}

export default Step;

