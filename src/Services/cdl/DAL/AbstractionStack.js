import {DESIGN} from "./DAL_CONSTANTS.js";
import DesignAbstraction from "./DesignAbstraction";

/**
 * Represents the abstraction stack with entries that
 * are represented with Design Abstraction object.
 *
 * Each stack is initialized with a starting position
 * in the execution, this position is used to get the
 * design abstraction that is being executed. Then the
 * design is walked through until the abstraction is
 * complete.
 *
 * For concurrent abstractions, everytime the design reaches
 * a step which produces a concurrent abstraction, it will
 * create a new stack object that will walk the concurrent
 * abstraction and return it to the current stack. In this
 * way, every fork from a design abstraction is contained
 * within a stack object.
 */
class AbstractionStack {
    /**
     * Initializes the abstraction stack.
     * @param {Object} design
     * @param {Array} threadDebuggers
     * @param {Object} initialPosition
     */
    constructor (design, threadDebuggers, initialPosition) {
        this.design = design;
        this.threadDebuggers = threadDebuggers;
        this.initialPosition = initialPosition;
        this.stack = [];
        console.log("");
        console.log("Initialized stack for position:", initialPosition);
        this.walkAbstraction();
    }


    /**
     * Walk the abstraction from the atomic position.
     */
    walkAbstraction () {
        const thread = this.threadDebuggers[this.initialPosition.execution.thread].thread;

        const abs = this.getDesignAbsFromExecution(this.initialPosition.execution.behavior.id);
        this.addToStack(abs);

        this.printState(
            this.initialPosition.execution.behavior,
            this.initialPosition.execution.functionalId
        );

        let position = this.initialPosition.position + 1;

        if (position >= thread.execution.length) {
            console.log("Reached end of file.");
            return;
        }
        do {
            const entry = thread.execution[position];
            if (entry?.behavior === undefined) {
                continue;
            }

            if (this.stack.length === 0) {
                break;
            }

            this.evaluateBehavior(entry.behavior.id, entry.functionalId);
        } while (++position < thread.execution.length);
    }

    /**
     * Gets the design abstraction from the executed abstraction.
     * @param {String} behaviorId
     * @return {Object}
     */
    getDesignAbsFromExecution (behaviorId) {
        console.log(this.design);
        for (let i = 0; i < this.design.length; i++) {
            const abs = this.design[i];
            if (abs?.entry) {
                if (abs.entry === behaviorId) {
                    return abs;
                }
            }
        }
    }

    /**
     * Add behavior to abstraction stack.
     * @param {Object} abs
     */
    addToStack (abs) {
        this.stack.push(
            new DesignAbstraction(abs)
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
                this.addToStack(module);
            }
        }
    }


    /**
     * Print the debug information.
     * @param {String} behavioralId
     * @param {String} functionalId
     */
    printState (behavioralId, functionalId) {
        if (this.stack.length === 0) {
            return;
        }
        const space = "    ";
        const spacer = space.repeat(this.stack.length - 1);
        console.log(spacer + behavioralId + "," + functionalId);
    }

    /**
     * Removes the stack positions that are done.
     * @param {*} id
     */
    moveDownStack (id) {
        while (this.stack.length > 0) {
            const top = this.getTopOfStack();
            if (top.testDone()) {
                this.popStack();
                continue;
            }
            return;
        }
    }

    /**
     * Evaluate the transition to the provided
     * behavioral id given the stack position.
     * @param {String} id
     * @param {String} functionalId
     */
    evaluateBehavior (id, functionalId) {
        const top = this.getTopOfStack();
        const result = top.testNext(id);

        if (result) {
            if (result.id === DESIGN.GOTO_MODULE) {
                this.goToModule(result.args.module);
            } else if (result.id === DESIGN.DESIGN_ABS_DONE) {
                this.popStack();
                this.moveDownStack(id);
            }
        }

        this.printState(id, functionalId);
    }
}

export default AbstractionStack;
