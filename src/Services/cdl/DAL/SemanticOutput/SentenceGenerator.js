/**
 * Given an atomic abstraction, this class generates sentences
 * that describes what happend in it.
 */
class SentenceGenerator {
    /**
     * Initialize the semantic generator with the trace
     * and the design info.
     * @param {Array} trace
     * @param {Object} design
     */
    constructor (trace, design) {
        this.trace = trace;
        this.design = design;
        console.log("Initialized Sentence Generator");
        this.processTrace();
    }

    /**
     * Process the trace.
     */
    processTrace () {
        for (let i = 0; i < this.trace.length; i++) {
            const entry = this.trace[i];
            const abstraction = this.getDesignAbstraction(entry.designAbsName);
            if (entry.currStep === 1) {
                this.processAbstraction(i, abstraction, entry.designAbsUid);
            }
        }
    }


    /**
     * Process the design abstraction to create the sentencs.
     * @param {Number} index
     * @param {Object} abstraction
     * @param {String} absUid
     */
    processAbstraction (index, abstraction, absUid) {
        console.log("");
        console.log("Action:", abstraction.action);
        console.log("Abstraction:", abstraction);
        for (let i = index; i < this.trace.length; i++) {
            const entry = this.trace[i];
            if (entry.designAbsUid !== absUid) {
                continue;
            }
            const currStep = entry.currStep - 1;
            const stepInfo = abstraction.steps[currStep];
            const placeHolders = stepInfo.placeholders;
            if (placeHolders) {
                console.log("Step Place Holders:", placeHolders);
            }
        }
    }

    /**
     * Get the design abstraction info given the ID.
     * @param {Object} module
     * @return {Object|null}
     */
    getDesignAbstraction (module) {
        for (let i = 0; i < this.design.length; i++) {
            if (this.design[i].id === module) {
                return this.design[i];
            }
        }
    }
}

export default SentenceGenerator;
