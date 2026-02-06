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

    }
}

export default AutomatedDebugger;
