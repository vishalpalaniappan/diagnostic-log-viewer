/**
 * This class contains a placeholder for a design abstraction.
 * These placeholders are used in the semantic abstraction action sentences.
 * They can access the value of semantic participants directly, they can
 * process the vaulue of semantic participants, or they can access
 * the state of a seleted abstraction in one of the steps.
 *
 * Through this, the semantic abstraction can generate meaningful
 * action sentences that reflect the actual execution of the design.
 */
class PlaceHolder {
    /**
     * Initialize the placeholder.
     * @param {Object} placeholder
     */
    constructor (placeholder) {
        Object.assign(this, placeholder);
    }

    /**
     * Sets the value of the placeholder
     * @param {*} value
     */
    setValue (value) {
        this.value = value;
    }

    /**
     * Returns the value of the placeholder.
     * @return {*}
     */
    getValue () {
        return this.value;
    }
}

export default PlaceHolder;
