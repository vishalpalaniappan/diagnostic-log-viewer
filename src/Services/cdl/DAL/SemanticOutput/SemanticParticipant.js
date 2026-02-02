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
        // console.log("Initialized semantic participant:", this.participant);
    }
}

export default SemanticParticipant;
