import { getSimpleUID } from "../helper";
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
}

export default Step;

