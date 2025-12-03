/**
 * This class constructures the execution tree using the abstraction map.
 */
class AbstractionMap {
    /**
     * Initialize the abstraction map.
     * @param {Object} map
     */
    constructor (map) {
        this.map = map.abstractions;
        this.printTreeToConsole = false;

        if (this.printTreeToConsole) {
            console.clear();
        }

        this.abstractionStack = [];
        this.currentAbstraction = null;
        this.executionTree = [];

        // Load the starting position into the abstraction map.
        for (const entry in this.map) {
            if (this.map[entry].start === true) {
                this.abstractionStack.push(this.map[entry]);
                this.currentAbstraction = this.map[entry];
            }
        }
    }


    /**
     * Validate the constraints
     * @param {Object} node
     * @param {Object} abstraction
     */
    validateConstraints (node, abstraction) {
        if ("constraint" in node) {
            for (let i = 0; i < node.constraint.length; i++) {
                const constraint = node.constraint[i];
                console.log(constraint);
            }
        }
    }

    /**
     * Add the provided id to the execution tree.
     * @param {Object} abstraction
     */
    mapCurrentLevel (abstraction) {
        const id = abstraction.abstraction_meta;
        if (this.abstractionStack.length > 0) {
            // move down abstraction level until you find parent of current id
            do {
                let found = false;
                this.currentAbstraction.abstractions.forEach((abs, index) => {
                    found = (abs.id === id)?true:found;
                });

                if (found) {
                    // found the abstraction, in the correct level
                    // we can exit the loop.
                    break;
                } else {
                    // haven't found the abstraction
                    // move down abstraction stack level
                    this.abstractionStack.pop();
                    const stackSize = this.abstractionStack.length - 1;
                    this.currentAbstraction = this.abstractionStack[stackSize];
                }
            } while (this.abstractionStack.length > 0);

            // check if the entry is in the abstraction.
            this.currentAbstraction.abstractions.forEach((entry, index) => {
                if (entry.id === id) {
                    if ("abstractions" in entry) {
                        // root abstraction with children
                        this.addToExecutionTree(entry, true, abstraction);
                        this.abstractionStack.push(entry);
                        this.currentAbstraction = entry;
                    } else {
                        // leaf abstraction with no children
                        if (entry.type === "function_call") {
                            this.addToExecutionTree(entry, true, abstraction);
                            this.abstractionStack.push(this.map[entry.target]);
                            this.currentAbstraction = this.map[entry.target];
                        } else {
                            this.addToExecutionTree(entry, false, abstraction);
                        }
                    }
                }
            });
        };
    }

    /**
     * This function adds the current position to the execution tree.
     * @param {Object} node Entry which corresponds to the intent.
     * @param {Boolean} collapsible Indicates if this row is collapsible.
     * @param {Object} abstraction Object containing the abstraction info.
     */
    addToExecutionTree (node, collapsible, abstraction) {
        this.validateConstraints(node, abstraction);
        this.executionTree.push({
            "level": this.abstractionStack.length,
            "intent": this.replacePlaceHoldersInIntent(node, abstraction.currVarStack),
            "collapsible": collapsible,
            "collapsed": false,
            "index": this.executionTree.length,
            "filePath": abstraction.getFilePath(),
            "fileName": abstraction.getFileName(),
            "lineno": abstraction.getLineNo(),
            "threadId": abstraction.threadId,
            "position": abstraction.position,
            "abstractionId": abstraction.abstraction_meta,
            "abstractionType": node.type,
        });
        if (this.printTreeToConsole) {
            this.printLevel(this.abstractionStack.length, entry.intent);
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

        let updatedIntent = entry.intent;

        variables.forEach((variable) => {
            const scope = variable.scope;

            if (scope === "local" && variable.name in currVarStack[0]) {
                variable.value = currVarStack[0][variable.name];
            } else if (scope === "global" && variable.name in currVarStack[1]) {
                variable.value = currVarStack[1][variable.name];
            } else {
                console.warn("Unable to find variable value to replace placeholder");
                return updatedIntent;
            }

            if ("key" in variable && variable.key in variable.value) {
                variable.value = variable.value[variable.key];
            } else if ("key" in variable) {
                console.warn("Unable to access key of variable to replace placeholder");
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
    printLevel(length, intent) {
        let str = "";
        for (let i = 0; i < length; i++) {
            str += "   ";
        }
        str = str + intent;
        console.log(str);
    }
};

export default AbstractionMap;
