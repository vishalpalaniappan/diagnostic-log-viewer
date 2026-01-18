import AbstractionStack from "./AbstractionStack";
/**
 * Design Abstraction Language (DAL) class to work
 * with an instrumented DAL Specification (DALSpec).
 */
class DAL {
    /**
     * Initialize the DAL Interpretter
     * @param {Object} DALSpec Instrumented Specification
     * @param {Object} debuggers
     */
    constructor (DALSpec, debuggers) {
        console.log(DALSpec, debuggers);
        this.design = DALSpec.design;
        this.threadDebuggers = debuggers;
        console.log("Initialized DAL instance with spec:", this.design);
        this.atomicBehaviors = this.getAtomicBehaviors();
        this.atomicPositions = [];
        this.walkExecution();
    }

    /**
     * Walks the execution of the provided threads.
     */
    walkExecution () {
        // Get all the atomic positions
        const keys = Object.keys(this.threadDebuggers);
        for (let i = 0; i < keys.length; i++) {
            const thread = this.threadDebuggers[keys[i]].thread;
            let currBehavior;
            let output;
            for (let j = 0; j < thread.execution.length; j++ ) {
                // If output, save it so apply it to next execution
                if (thread.execution[j].type === "adli_output") {
                    output = thread.execution[j];
                    continue;
                }

                // Get the behavior of the execution
                const info = thread.header.getBehaviorFromExecution(thread.execution[j]);
                if (info === undefined) {
                    continue;
                }

                // Save the behavior to the execution for easy access
                const behavior = info.behavior;
                thread.execution[j].behavior = behavior;
                thread.execution[j].functionalId = info.functionalId;
                if (output) {
                    thread.execution[j].output = output;
                    output = null;
                }

                // If we enter new behavior and its atomic, add it to list.
                if (currBehavior !== behavior.id && this.atomicBehaviors.includes(behavior.id)) {
                    this.atomicPositions.push({
                        "position": j,
                        "execution": thread.execution[j],
                    });
                }
                currBehavior = behavior.id;
            }
        }
        console.log(this.atomicPositions);

        // Walk each atomic position
        for (let i = 0; i < this.atomicPositions.length; i++) {
            new AbstractionStack(this.design, this.threadDebuggers, this.atomicPositions[i]);
        }
    }

    /**
     * Returns the atomic behaviors as specified by the design.
     * @return {Array} atomicBehaviors
     */
    getAtomicBehaviors () {
        const atomicBehaviors = [];
        for (let i = 0; i < this.design.length; i++) {
            if (this.design[i]?.type === "atomic") {
                atomicBehaviors.push(
                    this.design[i]?.entry
                );
            }
        }
        return atomicBehaviors;
    }
}

export default DAL;
