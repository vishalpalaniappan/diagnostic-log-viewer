import SemanticParticipant from "./SemanticParticipant";
/**
 * Class representing a behavior in the design abstraction.
 */
class Behavior {
    /**
     * Initialize the object.
     * @param {Object} behaviorInfo
     */
    constructor (behaviorInfo) {
        this.behaviorInfo = {...behaviorInfo};
        this.execution = [];
        this.stateVariables = {};
        this.participants = [];
    }

    /**
     * Adds the execution to the behavior.
     * @param {Object} entry
     */
    addExecution (entry) {
        this.execution.push(entry);
    }

    /**
     * Load the participants of this behavior.
     */
    loadParticiants () {
        console.log(this.behaviorInfo.intent);
        if (!("participants" in this.behaviorInfo)) {
            return;
        }
        for (let i = 0; i < this.behaviorInfo.participants.length; i++) {
            const variable = this.behaviorInfo.participants[i];
            const participant = new SemanticParticipant(variable);

            for (let j = 0; j < this.execution.length; j++) {
                const entry = this.execution[j];

                if (entry.functionalId === variable.functionalId) {
                    let varKey;
                    if (variable.scope === "local") {
                        varKey = 0;
                    } else if (variable.scope === "global") {
                        varKey = 1;
                    } else {
                        console.error("Unknown variable scope type.");
                        return;
                    }

                    if (variable.name in entry.varStack[varKey]) {
                        const value = entry.varStack[varKey][variable.name];
                        if ("key" in variable && variable.key === "length") {
                            participant.setValue(value.length);
                        } else if ("key" in variable) {
                            participant.setValue(value[variable.key]);
                        } else {
                            participant.setValue(value);
                        }
                        break;
                    }
                }
            }
            this.participants.push(participant);
        }
    }

    /**
     * Load the placeholders in the behavior.
     */
    loadPlaceHolders () {
        if (!("placeholders" in this.behaviorInfo)) {
            return;
        }
        for (let i = 0; i < this.behaviorInfo.placeholders.length; i++) {
            const placeholder = this.behaviorInfo.placeholders[i];
        }
    }

    /**
     * Generate the realized intent of behavior from
     * participants and placeholders.
     */
    generateRealizedIntent () {

    }
}

export default Behavior;
