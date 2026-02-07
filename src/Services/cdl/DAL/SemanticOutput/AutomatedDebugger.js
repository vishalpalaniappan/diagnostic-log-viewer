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
        this.violations = [];
        this.getViolations();
        this.processViolations();
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
                this.violations.push({
                    behavior: behavior,
                    violation: violations[i],
                });
            }
        }
    }

    /**
     * Process the extracted violations
     */
    processViolations () {
        for (let i = 0; i < this.violations.length; i++) {
            const violation = this.violations[i].violation;
            const behavior = this.violations[i].behavior;

            if (violation.violation_type === "invariant") {
                const uid = violation.uid;
                const guardedBehavior = violation.guards[0];
                const behaviorId = behavior.behaviorInfo.id;
                console.log("");
                console.log("For invariant violation in",
                    behaviorId,
                    "I looked for guarded behavior",
                    guardedBehavior,
                    "with uid",
                    uid
                );
                this.getBehaviorGivenInvariant(guardedBehavior, uid);
            }
        }
    }


    /**
     * Given an invariant, get the behavior it guards with a participant
     * that has the same uid.
     * @param {String} guardedBehavior
     * @param {String} uid
     */
    getBehaviorGivenInvariant (guardedBehavior, uid) {
        for (let i = 0; i < this.violations.length; i++) {
            const behavior = this.violations[i].behavior;

            if (behavior.behaviorInfo.id !== guardedBehavior) {
                continue;
            }

            for (let j = 0; j < behavior.participants.length; j++) {
                if (behavior.participants[j].value.uid === uid) {
                    console.log("Found guarded behavior",
                        guardedBehavior,
                        "of invariant using uid",
                        uid
                    );
                }
            }
        }
    }
}

export default AutomatedDebugger;
