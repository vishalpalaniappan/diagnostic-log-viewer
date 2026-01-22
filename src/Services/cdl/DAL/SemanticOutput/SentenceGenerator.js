import { object } from "prop-types";
import { Placeholder } from "react-bootstrap";

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
        const traceGroup = [];
        for (let i = index; i < this.trace.length; i++) {
            const entry = this.trace[i];
            if (entry.designAbsUid === absUid) {
                traceGroup.push(entry);
            }
        }

        if (abstraction?.placeholders) {
            const values = {};
            for (let i = 0; i < abstraction.placeholders.length; i++) {
                const placeHolder = abstraction.placeholders[i];
                const foundValues = this.processPlaceHolder(placeHolder, traceGroup);
                Object.assign(values, foundValues);
            }
            const sentence = this.replacePlaceHolders(abstraction.action, values);
            console.log(sentence);
        }
    }

    /**
     * Process the entry with the placeholders and return values.
     * @param {Array} placeholder
     * @param {Object} traceGroup
     * @return {String}
     */
    processPlaceHolder (placeholder, traceGroup) {
        const values = {};
        if (placeholder.type === "step_existence_check") {
            values[placeholder.placeholder] = placeholder.value_if_false;
        }

        for (let i = 0; i < traceGroup.length; i++) {
            const entry = traceGroup[i];
            if (placeholder.step !== entry.step.id) {
                continue;
            }

            if (placeholder.type === "option_value") {
                values[placeholder.placeholder] = entry.selectedValue;
            }

            if (placeholder.type === "variable_in_behavior") {
                for (let j = 0; j < entry.execution.length; j++) {
                    const exec = entry.execution[j];
                    const behavior = exec.behavior.id;
                    const funcId = exec.functionalId;
                    if (behavior === placeholder.behavior && funcId === placeholder.functionalid) {
                        if (placeholder.name in exec.varStack[0]) {
                            const placeholderValue = exec.varStack[0][placeholder.name];
                            if ("key" in placeholder) {
                                values[placeholder.placeholder] = placeholderValue[placeholder.key];
                            } else {
                                values[placeholder.placeholder] = placeholderValue;
                            }
                        }
                    }
                }
            }

            if (placeholder.type === "step_execution_count") {
                const placeholderKey = placeholder.placeholder;
                if (!(placeholderKey in values)) {
                    values[placeholderKey] = 1;
                } else {
                    values[placeholderKey] = values[placeholderKey] + 1;
                }
            }

            if (placeholder.type === "step_existence_check") {
                values[placeholder.placeholder] = placeholder.value_if_true;
            }
        }
        return values;
    }

    /**
     * Replaces the placeholders in the abstractions action sentence.
     * @param {String} sentence
     * @param {Object} placeholdersObj
     * @return {String}
     */
    replacePlaceHolders (sentence, placeholdersObj) {
        const placeholders = Object.keys(placeholdersObj);
        for (let i = 0; i < placeholders.length; i++) {
            const key = placeholders[i];
            sentence = sentence.replace(key, placeholdersObj[key]);
        }
        return sentence;
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
