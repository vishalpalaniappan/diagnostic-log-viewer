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
            if (!("behaviors" in abs.steps[i])) {
                continue;
            }
            const behavior = abs.steps[i].behaviors[0];
            if (!"violations" in behavior) {
                continue;
            }
            const violations = abs.steps[i].behaviors[0].violations;
            if (violations.length > 0) {
                const id = behavior.behaviorInfo.id;
                console.log(id + ": " + violations[0].violation_type, violations[0].guards);
            }
        }
    }
}

export default AutomatedDebugger;
