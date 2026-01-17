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
        this.abstractionStack = new AbstractionStack();
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
     * @return {null}
     */
    moveCursor (behavior, functionalId) {
        if (this.abstractionStack.isEmpty()) {
            console.log("We are already done");
            return true;
        }

        this.abstractionStack.evaluateBehavior(behavior);
        // this.moveStep(behavior);

        // if (!this.abstractionStack.isEmpty()) {
        //     this.printEntry(behavior, functionalId);
        // }
    }

    /**
     * Move to the next step.
     * @param {Object} behavior
     */
    moveStep (behavior) {
        const entry = this.abstractionStack.getTopOfStack();
        const currStep = entry.abstraction.steps[entry.step];

        // The behavior is the same as what is being exhibted
        if (currStep.behavior.includes(behavior)) {
            return;
        }

        do {
            const entry = this.abstractionStack.getTopOfStack();
            if (entry.step + 1 >= entry.abstraction.steps.length) {
                this.abstractionStack.popStack();
            } else {
                const entry = this.abstractionStack.getTopOfStack();
                entry.step++;

                const currStep = entry.abstraction.steps[entry.step];
                if (currStep.type === "selector") {
                    // TODO: Validate that the selected behavior
                    // is a valid option
                    this.setCursor(behavior);
                }
                break;
            }
        } while (!this.abstractionStack.isEmpty());
    }

    /**
     * Pretty prints the current state.
     * @param {String} behavior
     * @param {String} functionalId
     */
    printEntry (behavior, functionalId) {
        const spaces = 4;
        const spacer = " ".repeat(spaces);
        const space = spacer.repeat(this.abstractionStack.getStackSize());
        console.log(space + behavior+"-"+functionalId);
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
