import DesignAbstraction from "./DesignAbstraction";
/**
 * Represents an instance of an abstraction object
 * loaded into the abstraction stack.
 */
class AbstractionStack {
    /**
     * Initializes the abstraction stack.
     */
    constructor() {
        this.stack = [];
    }
    /**
     * Add behavior to abstraction stack.
     */
    addToStack () {
    }

    /**
     * Removes the top of the stack.
     */
    popStack () {
    }

    /**
     * Evaluate the transition to the provided
     * behavioral id given the stack position.
     * @param {String} id
     */
    evaluateBehavior (id) {
    }
}

export default AbstractionStack;
