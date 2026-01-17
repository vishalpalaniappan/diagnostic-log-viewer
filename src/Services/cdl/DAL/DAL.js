import AbstractionStack from "./AbstractionStack";
/**
 * Design Abstraction Language (DAL) class to work
 * with an instrumented DAL Specification (DALSpec).
 */
class DAL {
    /**
     * Initialize the DAL Interpretter
     * @param {Object} DALSpec Instrumented Specification
     */
    constructor (DALSpec) {
        this.design = DALSpec.design;
        console.log("Initialized DAL instance with spec:", this.DALSpec);
        this.currentAbstraction = null;
        this.currentBehavior = null;
        this.currentStep = null;
        this.abstractionStack = new AbstractionStack(DALSpec);
    }

    /**
     * Set the cursor of the DAL execution walker by passing
     * it the atomic design abstraction.
     * @param {Object} behavior
     */
    setCursor (behavior) {
        for (let i = 0; i < this.design.length; i++) {
            const abs = this.design[i];
            if (abs?.entry) {
                if (abs.entry === behavior) {
                    this.abstractionStack.addToStack(abs);
                }
            }
        }
    }

    /**
     * Move the cursor by passing the next abstraction that
     * was read from the execution. This function will validate
     * the next move through the designs structure.
     * @param {Object} behavior
     * @param {Object} functionalId
     * @return {Boolean|null}
     */
    moveCursor (behavior, functionalId) {
        this.abstractionStack.evaluateBehavior(behavior, functionalId);

        if (this.abstractionStack.isEmpty()) {
            console.log("Atomic behvior has finished.");
            return true;
        }
    }

    /**
     * Lists the design abstractions specified in DALSpec.
     */
    listAbstractions () {

    }

    /**
     * Describes the specified DALSpec.
     * @param {String} id ID of the abstraction.
     */
    describeAbstraction (id) {

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
