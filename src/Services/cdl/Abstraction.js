
/**
 * Represents an instance of an abstraction object
 * loaded intot he abstraction stack.
 */
class DesignAbstraction {
    /**
     * Initializes the abstraction.
     * @param {Object} abstraction
     * @param {Number} step
     */
    constructor(abstraction, step) {
        this.abstraction = abstraction;
        this.currentStep = step;
    }
    /**
     * Given an ID, if the next step
     * can be taken given the current state.
     * @param {String} id 
     */
    testNext(id) {

    }
}

export default DesignAbstraction;
