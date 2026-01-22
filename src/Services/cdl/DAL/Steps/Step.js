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
        if (this.step.type === "selector") {
            const placeholder = this.step.placeholders[0].placeholder;
            values[placeholder] = this.selectedValue;
        }
        return values;
    }
}

export default Step;

