import { getSimpleUID } from "../helper";
/**
 * Base step object.
 */
class Step {
    /**
     * Initialize the object with a simple uid.
     */
    constructor() {
        this.uid = getSimpleUID();
    }
}

export default Step;

