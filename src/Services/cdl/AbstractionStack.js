import DesignAbstraction from "./DesignAbstraction";
/**
 * Represents the abstraction stack with entries that
 * are represented with Design Abstraction object.
 */
class AbstractionStack {
    /**
     * Initializes the abstraction stack.
     */
    constructor () {
        this.stack = [];
    }
    /**
     * Add behavior to abstraction stack.
     * @param {Object} abs
     */
    addToStack (abs) {
        this.stack.push(
            new DesignAbstraction(abs, 0)
        );
    }

    /**
     * Returns a boolean value indicating if
     * the stack is empty.
     * @return {Boolean}
     */
    isEmpty () {
        return this.stack.length === 0;
    }

    /**
     * Returns the entry at the top of the stack.
     * @return {DesignAbstraction}
     */
    getTopOfStack () {
        if (!this.isEmpty()) {
            return this.stack[this.stack.length - 1];
        }
    }

    /**
     * Returns the size of the stack.
     * @return {Number}
     */
    getStackSize () {
        return this.stack.length;
    }

    /**
     * Removes the top of the stack.
     */
    popStack () {
        if (!this.isEmpty()) {
            this.stack.pop();
        }
    }

    /**
     * Evaluate the transition to the provided
     * behavioral id given the stack position.
     * @param {String} id
     */
    evaluateBehavior (id) {
        const top = this.getTopOfStack();

        top.testNext(id);
    }
}

export default AbstractionStack;
