import {isEqual} from "lodash-es";

import PlaceHolder from "./PlaceHolder";
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
        this.placeholders = [];
        this.violations = [];
    }

    /**
     * Adds the execution to the behavior.
     * @param {Object} entry
     */
    addExecution (entry) {
        this.execution.push(entry);
        if (entry.exception) {
            this.violations.push({
                "violation_type": "exception",
                "exception": entry.exception,
            });
        }
        if (entry.availabilityViolation) {
            this.violations.push({
                "violation_type": "availability_violation",
            });
        }
    }

    /**
     * Load the participants of this behavior.
     */
    loadParticiants () {
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

            // Append the violations to the array
            if (participant.violations.length > 0) {
                this.violations = this.violations.concat(participant.violations);
            }
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
            const info = this.behaviorInfo.placeholders[i];
            const placeholder = new PlaceHolder(info, this.participants);
            this.placeholders.push(placeholder);
        }
    }

    /**
     * Generate the realized intent of behavior from
     * participants and placeholders.
     */
    generateRealizedIntent () {
        let sentence = this.behaviorInfo.intent;
        for (let i = 0; i < this.placeholders.length; i++) {
            const placeholder = this.placeholders[i];
            const value = placeholder.getValue();
            if (value) {
                sentence = sentence.replace(placeholder.getString(), value);
            }
        }
        this.sentence = sentence;
    }


    /**
     * Validate that the intent was realized correctly.
     */
    validateRealizedIntent () {
        if (!("intent_validation" in this.behaviorInfo)) {
            return;
        }

        for (let i = 0; i < this.behaviorInfo.intent_validation.length; i++) {
            const info = this.behaviorInfo.intent_validation[i];

            if (info.type === "data_exists" && info.position === "end") {
                const sourceParticipant = this.getParticipant(info.source_var);
                const targetParticipant = this.getParticipant(info.target_var);
                const targetValue = targetParticipant.value[targetParticipant.value.length -1];

                if (!isEqual(sourceParticipant.value, targetValue)) {
                    const violation = `${sourceParticipant.name} was not found at the\
                     end of the ${targetParticipant.name}`;
                    info.sentence = violation;
                    this.violations.push(info);
                }
            }
        }
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

export default Behavior;

