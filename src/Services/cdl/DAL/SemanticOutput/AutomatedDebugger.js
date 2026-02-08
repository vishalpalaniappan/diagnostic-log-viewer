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
        this.exceptions = [];
        this.invariantViolations = [];
        this.availabilityViolations = [];

        this.atomicAbstractions = abstractions;
        this.getViolations();
        this.processExceptions();
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
            if (violations.length === 0) {
                continue;
            }
            for (let i = 0; i < violations.length; i++) {
                console.log(violations[i].violation_type);
                const type = violations[i].violation_type;
                if (type === "exception") {
                    this.exceptions.push({
                        behavior: behavior,
                        violation: violations[i],
                    });
                } else if (type === "invariant") {
                    this.invariantViolations.push({
                        behavior: behavior,
                        violation: violations[i],
                    });
                } else if (type === "availability_violation") {
                    this.availabilityViolations.push({
                        behavior: behavior,
                        violation: violations[i],
                    });
                }
            }
        }
    }

    /**
     * Process the exceptions from the execution
     */
    processExceptions () {
        for (let i = 0; i < this.exceptions.length; i++) {
            const exception = this.exceptions[i];
            this.findViolationGivenException(exception);
        }
    }

    /**
     * Given an exception find the violation
     * @param {Object} exception
     */
    findViolationGivenException (exception) {
        // There is no root cause to this exception that can be found.
        if (this.invariantViolations.length === 0) {
            return;
        }

        const uids = [];
        for (let j = 0; j < exception.behavior.participants.length; j++) {
            const participant = exception.behavior.participants[j];
            if (!"value" in participant) {
                continue;
            }
            const value = participant.value;
            if (!(typeof value === "object" && !Array.isArray(value) && value !== null)) {
                continue;
            }
            if ("uid" in participant?.value) {
                uids.push(participant.value.uid);
            }
        }

        // Identify the root cause of each exception and remove
        // from invariant violations after assigning it to exception.
        let pos = this.invariantViolations.length - 1;
        do {
            const violationUid = this.invariantViolations[pos].violation.uid;
            if (uids.includes(violationUid)) {
                exception.rootCause = this.invariantViolations[pos];
                this.invariantViolations.pop();
            }
        } while (--pos > 0);

        // Note: The violations that remain in invariantViolations will not
        // have resulted in a failure but would have if the execution continued.
    }
}

export default AutomatedDebugger;
