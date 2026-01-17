import {DESIGN} from "./DAL_CONSTANTS.js";
import DesignAbstraction from "./DesignAbstraction";

/**
 * Represents the abstraction stack with entries that
 * are represented with Design Abstraction object.
 */
class AbstractionStack {
    /**
     * Initializes the abstraction stack.
     * @param {Object} DALSpec
     */
    constructor (DALSpec) {
        this.design = DALSpec.design;
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
     * Given a target module, this function looks through
     * the design and goes to the provided module.
     * @param {String} targetModule Module to go to.
     */
    goToModule (targetModule) {
        for (let i = 0; i < this.design.length; i++) {
            const module = this.design[i];
            if (module.entry === targetModule) {
                this.stack.push(
                    new DesignAbstraction(module, 0)
                );
            }
        }
    }


    /**
     * Print the debug information.
     * @param {String} behavioralId
     * @param {String} functionalId
     */
    printState (behavioralId, functionalId) {
        const space = "    ";
        const spacer = space.repeat(this.stack.length - 1);
        console.log(spacer + behavioralId + "," + functionalId);
    }

    /**
     * Evaluate the transition to the provided
     * behavioral id given the stack position.
     * @param {String} id
     * @param {String} functionalId
     */
    evaluateBehavior (id, functionalId) {
        const top = this.getTopOfStack();
        const result = top.testNext(id, functionalId);

        if (result) {
            if (result.id === DESIGN.GOTO_MODULE) {
                // console.log("Going to module:", result.args);
                this.goToModule(result.args.module);
            } else if (result.id === DESIGN.DESIGN_ABS_DONE) {
                // console.log("DESIGN ABS DONE");
                this.popStack();
            }
        }
        const currentStep = this.getTopOfStack().getCurrentStep();
        this.printState(currentStep.getBehavior(), functionalId);
    }
}

export default AbstractionStack;
