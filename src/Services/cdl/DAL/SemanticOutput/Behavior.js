/**
 * Class representing a behavior in the design abstraction.
 */
class Behavior {
    /**
     * Initialize the object.
     * @param {String} id
     */
    constructor (id) {
        this.id = id;
        this.execution = [];
    }

    /**
     * Adds the execution to the behavior.
     * @param {Object} entry
     */
    addExecution (entry) {
        this.execution.push(entry);
    }
}

export default Behavior;
