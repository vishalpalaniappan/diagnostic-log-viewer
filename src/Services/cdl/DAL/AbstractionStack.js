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
     * @param {Boolean} isFork
     */
    constructor (design, threadDebuggers, initialPosition, isFork) {
        this.design = design;
        this.threadDebuggers = threadDebuggers;
        this.initialPosition = initialPosition;
        this.stack = [];
        this.isFork = isFork;
        console.log("");
        console.log("Initialized stack for position:", initialPosition);
        this.walkAbstraction();
    }


    /**
     * Walk the abstraction from the atomic position.
     */
    walkAbstraction () {
        let thread = this.threadDebuggers[this.initialPosition.execution.thread].thread;

        // Initialize the stack with the initial design abstraction
        const abs = this.getDesignAbsFromExecution(this.initialPosition.execution.behavior.id);
        this.addToStack(abs);

        // Evaluate the behavior of the initial position
        const status = this.evaluateBehavior(
            {
                behavioralId: this.initialPosition.execution.behavior.id,
                functionalId: this.initialPosition.execution.functionalId,
            },
            thread.execution[this.initialPosition.position]
        );
        if (status === false) {
            console.warn("Error in evaluating behavior of atomic position, terminating");
        }


        let position = this.initialPosition.position + 1;

        // If the stack is a fork, then track the output before starting.
        if (this.isFork) {
            const input = this.trackOutput(this.initialPosition.execution);
            if (input) {
                thread = this.threadDebuggers[input.thread].thread;
                position = input.position;
            }
        }

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
                console.log("Atomic design abstraction done");
                break;
            }

            const executionInfo = {
                "position": position,
                "execution": entry,
            };

            const status = this.evaluateBehavior(
                {
                    behavioralId: entry.behavior.id,
                    functionalId: entry.functionalId,
                    variableStack: thread.getVariablesAtPosition(position),
                },
                executionInfo
            );

            if (status === false) {
                console.log("Errored when evaluating behavior");
                return;
            }

            // If we are in a fork and its an output, then track.
            if (this.isFork && entry.output) {
                const input = this.trackOutput(entry);
                if (input) {
                    thread = this.threadDebuggers[input.thread].thread;
                    // Subtracting one from position because it gets incremented
                    // in the do while condition evaluation below.
                    position = input.position - 1;
                }
            }
        } while (++position < thread.execution.length);
    }

    /**
     * Tracks the output to the input.
     * @param {Object} execution
     * @return {Object}
     */
    trackOutput (execution) {
        if (!execution.output) {
            return;
        }

        const outputId = execution.output.adliExecutionId;
        const keys = Object.keys(this.threadDebuggers);
        for (let i = 0; i < keys.length; i++) {
            const thread = this.threadDebuggers[keys[i]].thread;
            for (let j = 0; j < thread.execution.length; j++ ) {
                const execution = thread.execution[j];
                if (execution.input) {
                    const inputId = execution.input.adliExecutionId;
                    if (inputId === outputId) {
                        return {
                            thread: keys[i],
                            position: j,
                        };
                    }
                }
            }
        }
    }

    /**
     * Gets the design abstraction from the executed abstraction.
     * @param {String} behaviorId
     * @return {Object}
     */
    getDesignAbsFromExecution (behaviorId) {
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
     * Add the design abstraction to the stack.
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
     * Evaluate the transition to the provided
     * behavioral id given the stack position.
     * @param {String} info
     * @param {Object} execution
     * @return {Boolean}
     */
    evaluateBehavior (info, execution) {
        while (true) {
            if (this.stack.length === 0) {
                return;
            }

            const top = this.getTopOfStack();

            // Check if the top of the stack is done and remove it.
            if (top && top.step >= top.steps.length) {
                this.popStack();
                if (this.stack.length === 0) {
                    console.log("     CONCLUDE ATOMIC ABSTRACTION");
                    return;
                } else {
                    const top = this.getTopOfStack();
                    console.log(`     > RETURN to ${top.name}`);
                }
                continue;
            }

            const result = top.testNext(info);

            if (result) {
                // Go to module and continue with same execution.
                if (result.id === DESIGN.GOTO_MODULE) {
                    this.goToModule(result.args.module);
                    continue;
                }

                // If design step is done, continue with the same
                // execution position.
                if (result.id === DESIGN.STEP_DONE) {
                    continue;
                }

                // Create new stack and fork from position
                if (result.id === DESIGN.FORK) {
                    new AbstractionStack(this.design, this.threadDebuggers, execution, true);
                    return;
                }

                // Continue to next execution.
                if (result.id === DESIGN.CONTINUE) {
                    return;
                }

                // Error in design
                if (result.id === DESIGN.ERROR) {
                    return false;
                }
            }
            break;
        }
    }
}

export default AbstractionStack;
