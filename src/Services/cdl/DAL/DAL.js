import AbstractionStack from "./AbstractionStack";
import {SemanticTrace} from "./SemanticOutput/SemanticTrace.js";
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
        this.atomicAbstractions = this.getAtomicAbstractions();
        this.atomicPositions = [];
        SemanticTrace.setDesign(DALSpec);
        this.walkExecution();
        SemanticTrace.sendModel();
    }

    /**
     * Walks the execution of the provided threads.
     */
    walkExecution () {
        // Get all the atomic positions
        const keys = Object.keys(this.threadDebuggers);
        for (let i = 0; i < keys.length; i++) {
            const thread = this.threadDebuggers[keys[i]].thread;
            let currAbstraction;
            for (let j = 0; j < thread.execution.length; j++ ) {
                // Get the abstraction of the execution
                const info = thread.header.getAbstractionFromExecution(thread.execution[j]);
                if (info === undefined) {
                    continue;
                }

                // Save the abstraction to the execution for easy access
                const abstraction = info.abstraction;
                thread.execution[j].abstraction = abstraction;
                thread.execution[j].functionalId = info.functionalId;

                // If we enter new abstraction and its atomic, add it to list.
                const isAtomic = this.atomicAbstractions.includes(abstraction.id);
                if (currAbstraction !== abstraction.id && isAtomic) {
                    this.atomicPositions.push({
                        "position": j,
                        "execution": thread.execution[j],
                    });
                }
                currAbstraction = abstraction.id;
            }
        }
        console.log(this.atomicPositions);

        // Walk each atomic position
        for (let i = 0; i < this.atomicPositions.length; i++) {
            new AbstractionStack(this.design, this.threadDebuggers, this.atomicPositions[i], false);
        }
    }

    /**
     * Returns the atomic abstractions as specified by the design.
     * @return {Array} atomicAbstractions
     */
    getAtomicAbstractions () {
        const atomicAbstractions = [];
        for (let i = 0; i < this.design.length; i++) {
            if (this.design[i]?.type === "atomic") {
                atomicAbstractions.push(
                    this.design[i]?.entry
                );
            }
        }
        return atomicAbstractions;
    }
}

export default DAL;
