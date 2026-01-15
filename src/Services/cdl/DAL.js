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
    }

    /**
     * Set the cursor of the DAL execution walker by passing
     * it the atomic design abstraction.
     * @param {Object} behavior
     */
    setCursor (behavior) {
        console.log("Setting cursor:", behavior);
        for (let i = 0; i < this.design.length; i++) {
            const abs = this.design[i];
            if (abs?.entry) {
                if (abs.entry.behavior === behavior) {
                    this.currentAbstraction = abs;
                    this.currentBehavior = behavior;
                    this.currentStep = 0;
                }
            }
        }
    }

    /**
     * Move the cursor by passing the next abstraction that
     * was read from the execution. This function will validate
     * the next move through the designs structure.
     * @param {Object} behavior
     */
    moveCursor (behavior) {
        console.log(behavior);
        const isNewStep = this.checkCurrentStep(behavior);
        if (isNewStep) {
            console.log("Moved onto new step: ", this.currentStep);
        } else {
            console.log("In step: ", this.currentStep);
        }
    }


    /**
     * Checks if the provided behavior has moved onto the next step.
     * @param {Object} behavior
     * @return {Boolean}
     */
    checkCurrentStep (behavior) {
        const currStep = this.currentAbstraction.steps[this.currentStep];
        if (!currStep.behavior.includes(behavior)) {
            this.currentStep++;
            return true;
        }
        return false;
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
