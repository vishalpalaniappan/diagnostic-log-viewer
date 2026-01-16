import DesignAbstraction from "./Abstraction";
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
        this.abstractionStack = [];
    }

    /**
     * Set the cursor of the DAL execution walker by passing
     * it the atomic design abstraction.
     * @param {Object} behavior
     */
    setCursor (behavior) {
        // console.log("");
        // console.log("Setting cursor:", behavior);
        for (let i = 0; i < this.design.length; i++) {
            const abs = this.design[i];
            if (abs?.entry) {
                if (abs.entry.behavior === behavior) {
                    this.currentAbstraction = abs;
                    this.currentBehavior = behavior;
                    this.currentStep = 0;

                    this.abstractionStack.push(
                        new DesignAbstraction(
                            this.currentAbstraction,
                            this.currentStep
                        )
                    );
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
        if (this.abstractionStack.length === 0) {
            console.log("We are already done");
            return true;
        }

        this.moveStep(behavior);

        if (this.abstractionStack.length > 0) {
            this.printEntry(behavior, functionalId);
        }
    }

    /**
     * Move to the next step.
     * @param {Object} behavior
     */
    moveStep (behavior) {
        const as = this.abstractionStack;
        const entry = as[as.length - 1];
        const currStep = entry.abstraction.steps[entry.step];

        // The behavior is the same as what is being exhibted
        if (currStep.behavior.includes(behavior)) {
            return;
        }

        do {
            const entry = as[as.length - 1];
            if (entry.step + 1 >= entry.abstraction.steps.length) {
                this.abstractionStack.pop();
            } else {
                const entry = as[as.length - 1];
                entry.step++;

                const currStep = entry.abstraction.steps[entry.step];
                if (currStep.type === "selector") {
                    // TODO: Validate that the selected behavior
                    // is a valid option
                    this.setCursor(behavior);
                }
                break;
            }
        } while (this.abstractionStack.length > 0);
    }

    /**
     * Adds the current abstraciton and step to the stack.
     */
    addToStack () {
        const absStack = this.abstractionStack;

        if (absStack.length === 0) {
            absStack.push({
                abstraction: this.currentAbstraction,
                step: this.currentStep,
            });
            return;
        }

        const stackTop = absStack[absStack.length - 1];
        if (stackTop.abstraction === this.currentAbstraction) {
            stackTop.step = this.currentStep;
            return;
        }

        this.abstractionStack.push({
            abstraction: this.currentAbstraction,
            step: this.currentStep,
        });
    }

    /**
     * Pretty prints the current state.
     * @param {String} behavior
     * @param {String} functionalId
     */
    printEntry (behavior, functionalId) {
        const spaces = 4;
        const spacer = " ".repeat(spaces);
        const space = spacer.repeat(this.abstractionStack.length);
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
            if (this.design[i]?.entry?.type === "atomic") {
                atomicBehaviors.push(
                    this.design[i]?.entry?.behavior
                );
            }
        }
        return atomicBehaviors;
    }
}

export default DAL;
