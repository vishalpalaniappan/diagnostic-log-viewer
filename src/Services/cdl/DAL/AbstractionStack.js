import {DESIGN} from "./DAL_CONSTANTS.js";
import DesignAbstraction from "./DesignAbstraction";
import {SemanticTrace} from "./SemanticOutput/SemanticTrace.js";

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
        const uid = initialPosition.execution.thread + "-" + initialPosition.position;
        SemanticTrace.addAtomicAbstraction(uid);
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

        /**
         * Evaluate the behavior of the initial position.
         *
         * I manually add the initial position to the stack to start the
         * atomic abstraction (or forked abstraction). There is a more efficient
         * way to do this, but its ok for now.
         *
         * The way I see it is that I am  setting the stage before I walk
         * the design abstraction, so I am:
         * - initializing the stack with the atomic abstraction
         * - evaluating the first behavior to set the correct initial state
         * - if I am in a forked stack, I track the output to an input
         *   before i walk the design (if we are starting at an output).
         */
        const executionEntry = {...this.initialPosition.execution};
        executionEntry.varStack = thread.getVariablesAtPosition(this.initialPosition.position);

        const status = this.evaluateBehavior(
            executionEntry,
            thread.execution[this.initialPosition.position]
        );
        if (status === false) {
            console.warn("Error in evaluating behavior of atomic position, terminating");
            return;
        }

        let position = this.initialPosition.position;

        // If the stack is a fork, then track the output before starting
        if (this.isFork && this.initialPosition.execution?.output) {
            const input = this.trackOutput(this.initialPosition.execution);
            if (input) {
                thread = this.threadDebuggers[input.thread].thread;
                // Subtract one from position because it gets inc by while loop
                position = input.position - 1;
            }
        }

        // Walk the execution until the design abstraction finishes.
        while (++position < thread.execution.length) {
            const entry = thread.execution[position];
            if (entry?.behavior === undefined) {
                // Execution has variable logs, inputs, outputs etc.
                // We can ignore those.
                continue;
            }

            // Design abstraction is done because abstraction stack is empty.
            if (this.stack.length === 0) {
                if (this.isFork) {
                    console.log("Forked Design Abstraction Done.");
                } else {
                    console.log("Atomic Design abstraction done.");
                }
                break;
            }

            const executionEntry = {...entry};
            executionEntry.varStack = thread.getVariablesAtPosition(position);

            // Evaluate the execution position using the design.
            const status = this.evaluateBehavior(
                executionEntry,
                {
                    "position": position,
                    "execution": entry,
                }
            );

            // The design was unable to solve the executed position.
            if (status === false) {
                console.log("The design was unable to solve the execution position.");
                return;
            }

            // If we are in a fork and its an output, then track.
            if (this.isFork && entry.output) {
                const input = this.trackOutput(entry);
                if (input) {
                    thread = this.threadDebuggers[input.thread].thread;
                    // Subtract one from pos because it gets inc by while loop
                    position = input.position - 1;
                }
            }
        }
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
     * Evaluate the executed behavior by solving it with the design.
     *
     * This function performs the semantic transform by projecting
     * the design abstraction onto the execution. It does this by
     * walking the design abstraction as the execution. It asks the
     * current design abstraction to test the next execution position
     * and solve the path the design took to reach it.
     *
     * At any given point in the design, there is a defined path forward
     * for the execution. By providing the execution, the design is able
     * to identify the path that the execution took through the design. If it is
     * unable to do this, then the instrumentation is incomplete. This must be
     * true because the design is what produced the execution, so if you are
     * unable to project the design back onto the execution, then the design's
     * instrumentation is insufficient.
     *
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
                    return;
                } else {
                    const top = this.getTopOfStack();
                    const typeStr = "\x1b[31mRETURN\x1b[0m";
                    console.log(`${typeStr} to ${top.name}`);
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
                // execution position until it is solved.
                if (result.id === DESIGN.STEP_DONE) {
                    continue;
                }

                // Create new stack and fork from position
                if (result.id === DESIGN.FORK) {
                    new AbstractionStack(this.design, this.threadDebuggers, execution, true);
                    return;
                }

                // Return to main and continue processing execution.
                if (result.id === DESIGN.CONTINUE) {
                    return;
                }

                // Error in instrumentation
                if (result.id === DESIGN.ERROR) {
                    return false;
                }
            }
            break;
        }
    }
}

export default AbstractionStack;
