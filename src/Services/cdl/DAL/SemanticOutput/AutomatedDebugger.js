/**
 * This class accepts the abstractions that were
 * obtained at the output of the transform and
 * uses the semantic invariants to automatically
 * debug the execution and identify root causes.
 *
 * Technically the automated debugging already
 * happens when the invariants are validated but
 * this puts it all together and connects the
 * violations to downstream violations or
 * exceptions.
 */
class AutomatedDebugger {
    /**
     * Initialze the automated debugger.
     * @param {Object} abstractions
     */
    constructor (abstractions) {
        console.log(abstractions);
        this.atomicAbstractions = abstractions;
        this.getViolations();
    }

    /**
     * Gets the violations from the list of atoimc abstractions.
     */
    getViolations () {
        const absIds = Object.keys(this.atomicAbstractions);
        for (let i = 0; i < absIds.length; i++) {
            const atomicAbs = this.atomicAbstractions[absIds[i]];
            for (let j = 0; j < atomicAbs.designAbstractions.length; j++) {
                const abs = atomicAbs.designAbstractions[j];
                this.getViolationsFromDesignAbs(abs);
            }
        }
    }

    /**
     * Gets the violations from the provided design abstraction.
     * @param {Object} abs
     */
    getViolationsFromDesignAbs (abs) {
        for (let i = 0; i < abs.steps.length; i++) {
            // const violations = abs.steps[i].behaviors[0].violations;
            // const exceptions = abs.steps[i].behaviors[0].exceptions;
        }
    }
}

export default AutomatedDebugger;
