/**
 * Class representing a behavior in the design abstraction.
 */
class Behavior {
    /**
     * Initialize the object.
     * @param {Object} behaviorInfo
     */
    constructor (behaviorInfo) {
        this.behaviorInfo = behaviorInfo;
        this.execution = [];
    }

    /**
     * Adds the execution to the behavior.
     * @param {Object} entry
     */
    addExecution (entry) {
        this.execution.push(entry);
    }

    /**
     * Evaluate the state variables of the behavior.
     */
    evaluateState () {
        if (!("state_variables" in this.behaviorInfo)) {
            console.log(this.behaviorInfo.id, " doesn't have any state variables");
            return;
        }

        for (let i = 0; i < this.behaviorInfo.state_variables.length; i++) {
            const variable = this.behaviorInfo.state_variables[i];

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
                            variable.value = value[variable.key];
                        } else {
                            variable.value = value;
                        }
                    }
                }
            }
        }

        console.log(this.behaviorInfo.state_variables);
    }
}

export default Behavior;
