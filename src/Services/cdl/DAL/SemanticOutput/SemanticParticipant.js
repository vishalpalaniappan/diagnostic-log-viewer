/**
 * This class contains a semantic participant.
 *
 * The semantic participant represents an entity
 * involved in the semantic abstraction. It is defined
 * at the behavioral level and can hold the properties
 * of the participants in the behavior.
 * 
 * For example, in a behavior that is taking a book
 * from the basket, the semantic participants are the
 * basket and the book. This defines the behavior
 * uniquely and allows the semantic abstraction to
 * refer to these participants in its action sentences.
 *
 * The semantic participants will also be semantically
 * validated within this class. For example the book
 * is expected to have a name. This will then highlight
 * the behavior as semantically invalid and provide a
 * specific reason why.
 */
class SemanticParticipant {
    /**
     * Initialize the semantic participant.
     * @param {Object} participant
     */
    constructor (participant) {
        this.participant = {...participant};
        console.log("Initialized semantic participant:", this.participant);
    }

    /**
     * Set the value of the semantic participant.
     * @param {*} value
     */
    setValue (value) {
        this.value = value;
        console.log("Set semantic participant value:", this.participant.name, "=", this.value);
        this.validate();
    }

    /**
     * Validate the semantic participant.
     */
    validate () {
        if (!("constraint" in this.participant)) {
            return;
        }

        const constraints = this.participant.constraint;

        for (let i = 0; i < constraints.length; i++) {
            const rule = constraints[i];

            if (rule.type === "minLength") {
                /**
                 * Flag if:
                 *  - null
                 *  - not a string
                 *  - string is shorter than specified
                 */
                if (this.value === null || typeof this.value !== "string" ||
                    this.value.length < rule.value) {
                    console.error("Semantic participant validation failed:",
                        this.value,
                        "does not meet minLength of",
                        rule.value);
                }
            }
        }
    }
}

export default SemanticParticipant;
