/**
 * Class representing a behavior in the design abstraction.
 */
class Behavior {
    /**
     * Initialize the object.
     * @param {Object} behaviorInfo
     */
    constructor (behaviorInfo) {
        this.behaviorInfo = behaviorInfo;
        this.execution = [];
    }

    /**
     * Adds the execution to the behavior.
     * @param {Object} entry
     */
    addExecution (entry) {
        this.execution.push(entry);
    }

    /**
     * Evaluate the state variables of the behavior.
     */
    evaluateState () {
    }
}

export default Behavior;
