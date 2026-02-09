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
     * @param {Object} participants
     */
    constructor (placeholder, participants) {
        this.info = placeholder;
        this.participants = participants;
        this.setValue();
    }

    /**
     * Sets the value of the placeholder
     * @param {SemanticParticipant} participant
     */
    setValue () {
        switch (this.info.type) {
            case "value":
                this.processValue();
                break;
            case "key_value":
                this.processKeyValue();
                break;
            case "semantic_property":
                this.processSemanticProperty();
                break;
            default:
                break;
        }
    }

    /**
     * Process placeholders of type "value". These placeholders
     * simply assign the participants value to the placeholder.
     */
    processValue () {
        const participant = this.getParticipant(this.info.participantName);
        this.value = participant.value;
    }

    /**
     * Process the placeholder of type key_value. These palceholders
     * assign a specific key (or keys) from the participants value.
     */
    processKeyValue () {
        const participant = this.getParticipant(this.info.participantName);
        let value = participant.value;
        for (let i = 0; i < this.info.keys.length; i++) {
            const key = this.info.keys[i];
            value = value[key];
        }
        this.value = value;
    }

    /**
     * Process placeholders of type "semantic_property". These placeholders
     * get a specific property of the participant and then assignes it
     * to the palceholder value.
     */
    processSemanticProperty () {
        if (this.info.property === "length") {
            const participant = this.getParticipant(this.info.participantName);
            let value = participant.value;
            if ("keys" in this.info) {
                for (let i = 0; i < this.info.keys.length; i++) {
                    const key = this.info.keys[i];
                    value = value[key];
                }
            }
            this.value = value.length;
        }
    }

    /**
     * Returns the value of the placeholder.
     * @return {*}
     */
    getValue () {
        if (this.value !== undefined && this.value !== null) {
            return this.value.toString();
        } else {
            return this.value;
        }
    }

    /**
     * Returns the placeholder string. Ex: <num_books>
     * @return {String}
     */
    getString () {
        return this.info.string;
    }

    /**
     * Get the participant given the name.
     * @param {String} name
     * @return {SemanticParticipant|null}
     */
    getParticipant (name) {
        for (let i = 0; i < this.participants.length; i++) {
            const participant = this.participants[i];
            if (participant.participant.name === name) {
                return participant;
            }
        }
    }
}

export default PlaceHolder;
