/**
 * This class constructures the execution tree using the abstraction map.
 */
class AbstractionMap {
    /**
     * Initialize the abstraction map.
     * @param {Object} sdg
     * @param {Object} sdgMeta
     * @param {Object} designMap
     */
    constructor (sdg) {
        this.sdg = sdg;
        this.printTreeToConsole = false;

        if (this.printTreeToConsole) {
            console.clear();
        }

        this.abstractionStack = [];
        this.stack = [];
        this.executionTree = [];
        this.violations = [];
    }

    /**
     * Validate the constraints
     * @param {Object} abstraction
     */
    validateConstraints (abstraction) {
        const node = this.sdg.abstractions[abstraction.abstractionId];
        if ("constraint" in node) {
            for (let i = 0; i < node.constraint.length; i++) {
                const constraint = node.constraint[i];

                let varStack;
                let value;

                if (!abstraction.varStack) {
                    console.warn("varStack missing while validating constraints.");
                    continue;
                }

                // Load the relevant varstack based on the instrumented scope
                if (constraint.scope === "local") {
                    varStack = abstraction.varStack[0];
                } else if (constraint.scope === "global") {
                    varStack = abstraction.varStack[1];
                } else {
                    console.warn("Constraint has an invalid scope for the variable");
                    continue;
                }

                if (!varStack || !(constraint.name in varStack)) {
                    console.warn(`Variable name "${constraint.name}" is not in stack 
                        for constraint validation.`);
                    continue;
                }

                value = varStack[constraint.name];

                // Access the value through the key
                // TODO: Add functionality to add nested keys
                if ("key" in constraint && constraint.key in value) {
                    value = value[constraint.key];
                } else if ("key" in constraint) {
                    console.warn("Unable to access key of variable to validate constraint.");
                    continue;
                }

                if (constraint.type === "minLength") {
                    /**
                     * Flag if:
                     *  - null
                     *  - not a string
                     *  - string is shorter than specified
                     */
                    if (value === null || typeof value !== "string" ||
                        value.length < constraint.value) {
                        this.violations.push({
                            position: abstraction.position,
                            index: this.executionTree.length,
                            constraint: constraint,
                        });
                    }
                } else if (constraint.type === "is_object") {
                    /**
                     * Flag if:
                     *  - its null
                     *  - its an object but its an array
                     *  - its not an object
                    */
                    if (value === null || (typeof value === "object" && Array.isArray(value))
                        || (typeof value !== "object")) {
                        this.violations.push({
                            position: abstraction.position,
                            index: this.executionTree.length,
                            constraint: constraint,
                        });
                    }
                } else if (constraint.type === "is_array") {
                    /**
                     * Flag if:
                     *  - null
                     *  - its not an array
                     */
                    if (value === null || !Array.isArray(value)) {
                        this.violations.push({
                            position: abstraction.position,
                            index: this.executionTree.length,
                            constraint: constraint,
                        });
                    }
                } else if (constraint.type === "has_key" && "value" in constraint) {
                    const key = constraint["value"];
                    /**
                     * Flag if:
                     *  - null
                     *  - is object and is not an array and doesn't have the key
                     */
                    if (value === null || (typeof value === "object" && !Array.isArray(value)
                            && !Object.prototype.hasOwnProperty.call(value, key))) {
                        this.violations.push({
                            position: abstraction.position,
                            index: this.executionTree.length,
                            constraint: constraint,
                        });
                    }
                }
            }
        }
    }

    /**
     * Add the provided id to the execution tree.
     * @param {Object} abstraction
     */
    mapCurrentLevel (abstraction) {
        const id = abstraction.abstractionId;
        const levels = id.split("-");
        const thread = levels.shift();
        const module = levels.shift();

        // If the last entry in the execution tree is a function call,
        // we need to push the module onto the stack.
        if (this.executionTree.length > 0) {
            const tree = this.executionTree;
            if (tree[tree.length - 1].meta.type === "function_call") {
                this.stack.push({"module": module, "length": 1});
            }
        }

        // Move up the stack until we find current module or the stack is empty.
        while (this.stack.length > 0) {
            if (this.stack[this.stack.length -1].module === module) {
                break;
            }
            this.stack.pop();
        }

        if (this.stack.length === 0) {
            // If the stack is empty, we need to add the module.
            this.stack.push({"module": module, "length": levels.length});
        } else {
            // Update the length of the current module in the stack.
            this.stack[this.stack.length -1].length = levels.length;
        }

        // Calculate the current level based on the stack depth and lengths.
        const level = this.stack.reduce((sum, level) => sum + level.length, 0);

        this.validateConstraints(abstraction);

        const entry = {
            "level": level,
            "thread": thread,
            "intent": this.sdg.abstractions[id].intent,
            "index": this.executionTree.length,
            "filePath": abstraction.filePath,
            "fileName": abstraction.fileName,
            "lineno": abstraction.lineno,
            "threadId": abstraction.threadId,
            "position": abstraction.position,
            "abstraction": abstraction,
            "abstractionId": id,
            "abstractionType": this.sdg.abstractions[id]?.type,
            "meta": this.sdg.abstractions[id],
        };
        this.executionTree.push(entry);

        // Set the collapseible state of the previous entry
        // based on the current level.
        if (this.executionTree.length > 1) {
            const prevEntry = this.executionTree[this.executionTree.length -2];
            if (entry.level > prevEntry.level) {
                prevEntry.collapsible = true;
                prevEntry.collapsed = false;
            } else {
                prevEntry.collapsible = false;
                prevEntry.collapsed = false;
            }
        }
    }

    /**
     * Replaces the intent placeholders with the variable values.
     * @param {Object} entry
     * @param {Object} currVarStack
     * @return {String}
     */
    replacePlaceHoldersInIntent (entry, currVarStack) {
        /**
         * TODO: Make this more robust so that it doesn't try to
         * access nonexistent keys, variables or inject malformed data
         * into the placeholders.
         * */
        const variables = entry.variables;
        if (!variables || variables.length == 0) {
            return entry.intent;
        }

        if (!currVarStack) {
            console.warn("Valid VAR stack was not provided for replacing placholders in intent.");
            return entry.intent;
        }

        let updatedIntent = entry.intent;

        variables.forEach((variable) => {
            const scope = variable.scope;

            if (scope === "local" && variable.name in currVarStack[0]) {
                variable.value = currVarStack[0][variable.name];
            } else if (scope === "global" && variable.name in currVarStack[1]) {
                variable.value = currVarStack[1][variable.name];
            } else {
                console.warn("Did not find variable value to replace placeholder.");
                return updatedIntent;
            }

            if (variable && variable.value && "key" in variable && variable.key in variable.value) {
                variable.value = variable.value[variable.key];
            } else if ("key" in variable) {
                console.warn("Unable to access key of variable to replace placeholder.");
                return updatedIntent;
            }

            updatedIntent = updatedIntent.replace(variable.placeholder, variable.value);
        });

        return updatedIntent;
    }

    /**
     * Prints the design stack with the indentations to visualize it.
     * @param {*} length
     * @param {*} intent
     */
    printLevel (length, intent) {
        let str = "";
        for (let i = 0; i < length; i++) {
            str += "   ";
        }
        str = str + intent;
        console.log(str);
    }
};

export default AbstractionMap;
