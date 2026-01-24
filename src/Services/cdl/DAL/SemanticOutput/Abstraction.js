/**
 * Class representing a Abstraction in the design.
 */
class Abstraction {
    /**
     * Initialize the object.
     * @param {Object} abstractionInfo
     */
    constructor (abstractionInfo) {
        this.abstractionInfo = abstractionInfo;
        this.execution = [];
    }

    /**
     * Adds the execution to the abstraction.
     * @param {Object} executionEntry
     */
    addExecution (executionEntry) {
        this.execution.push(executionEntry);
    }

    /**
     * Evaluate the state variables of the abstraction.
     */
    evaluateState () {
        if (!("state_variables" in this.abstractionInfo)) {
            console.log(this.abstractionInfo.id, " doesn't have any state variables");
            return;
        }

        for (let i = 0; i < this.abstractionInfo.state_variables.length; i++) {
            const variable = this.abstractionInfo.state_variables[i];

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
                        if ("key" in variable) {
                            variable.value = value[placeholder.key];
                        } else {
                            variable.value = value;
                        }
                    }
                }
            }
        }

        console.log(this.abstractionInfo.state_variables);
    }
}

export default Abstraction;
