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
    constructor (sdg, sdgMeta, designMap) {
        this.sdg = sdg;
        this.map = sdg.modules;
        this.sdgMeta = sdgMeta;
        this.printTreeToConsole = false;

        this.designMap = designMap;

        if (this.printTreeToConsole) {
            console.clear();
        }

        this.abstractionStack = [];
        this.currentAbstraction = null;
        this.executionTree = [];
        this.violations = [];
        this.functionalBlocks = [];
        this.behavioralTree = [];


        // Load the starting position into the abstraction map.
        for (const entry in this.map) {
            if (this.sdgMeta[entry].start === true) {
                this.abstractionStack.push({
                    "value": this.map[entry],
                });
                this.currentAbstraction = this.map[entry];
            }
        }
    }

    /**
     * This function maps execution abstractions to the
     * functional abstraction in the design.
     *
     * @param {Object} abstraction
     * @return {Boolean}
     */
    mapExecutionToFunctionalAbstractions (abstraction) {
        // Get the module being executed so that we can
        // identify the fuctional abstraction.
        let module;
        const absStack = [...this.abstractionStack];
        for (let i = absStack.length - 1; i >= 0; i--) {
            if (absStack[i].value.type === "function") {
                module = absStack[i];
                break;
            }
        }

        if (!module) {
            console.warn("Could not find module currently being executed");
            return false;
        }

        if (!("functional_abstractions" in module.value)) {
            console.warn("Could not find functional abstractions for module.");
            return false;
        }

        const funcAbs = module.value.functional_abstractions;
        const currAbs = abstraction["abstraction_meta"];

        for (let i = 0; i < funcAbs.length; i++) {
            const functionalAbs = funcAbs[i];

            if (functionalAbs.abstractions.includes(currAbs)) {
                // Find the functional abstraction
                if (this.functionalBlocks.length > 0) {
                    const val = this.functionalBlocks[
                        this.functionalBlocks.length - 1
                    ];
                    // If we are in a new functional abstraction
                    // then add it to the functional blocks.
                    if (val.functionalAbs.id !== functionalAbs.id) {
                        this.functionalBlocks.push({
                            "functionalAbs": functionalAbs,
                            "abstraction": abstraction,
                        });
                    } else {
                        val.abstraction = abstraction;
                    }
                } else {
                    this.functionalBlocks.push({
                        "functionalAbs": functionalAbs,
                        "abstraction": abstraction,
                    });
                }
                return this.functionalBlocks[
                    this.functionalBlocks.length -1
                ];
            }
        }

        console.log("couldn't find it");
    }

    /**
     * Extracts the behaviors in the execution and the
     * hierarchy through which they are reached.
     */
    mapFunctionalAbstractionToBehavior () {
        let index = 0;

        /**
         * Note the behavioral stack is a 2d stack, it contains the
         * horizontal movement through the functional abstractions
         * of the behavior and the vertical movement of behavior
         * through the selectors.
         */
        const behaviorStack = [];
        do {
            const entry = this.functionalBlocks[index].functionalAbs;
            const currentBehavior = this.getBehavior(entry.id);

            if (!currentBehavior) {
                continue;
            }

            // Check if its the first intent (used for collapsing)
            const isFirstFuncAbs = (currentBehavior.abstractions[0] === entry.id);

            while (behaviorStack.length > 0) {
                const stackTop = behaviorStack[behaviorStack.length - 1];

                if (stackTop.entry.type === "selector" &&
                    stackTop.entry.targetBehaviors.includes(currentBehavior.id)) {
                    // Find the stack position which selecte this behavior.
                    behaviorStack.push({
                        "behavior": currentBehavior,
                        "entry": entry,
                        "position": 1,
                    });
                    break;
                } else if (stackTop.behavior.id === currentBehavior.id) {
                    // Update the pos of the behavior that is being executed.
                    behaviorStack[behaviorStack.length - 1] = {
                        "behavior": currentBehavior,
                        "entry": entry,
                        "position": stackTop.behavior.abstractions.indexOf(entry.id) + 1,
                    };
                    break;
                }
                // Remove the behavior from the stack, it is done.
                behaviorStack.pop();
            }

            // We ended up removing all the behaviors from the stack, so add
            // the current one to it as it is the behavior being exhibited.
            if (behaviorStack.length === 0) {
                behaviorStack.push({
                    "behavior": currentBehavior,
                    "entry": entry,
                    "position": 1,
                });
            }

            const level = behaviorStack.length;

            this.createTree(
                isFirstFuncAbs,
                level,
                currentBehavior.id,
                entry.id
            );
        } while ( ++index < this.functionalBlocks.length);
    }

    /**
     * @param {Boolean} isFirst
     * @param {Number} level
     * @param {String} behavior
     * @param {String} entry
     */
    createTree (isFirst, level, behavior, entry) {
        if (isFirst) {
            this.behavioralTree.push({
                "level": level - 1,
                "type": "selector",
                "id": behavior,
                "collapsible": true,
            });
        }
        this.behavioralTree.push({
            "level": level,
            "type": "node",
            "id": entry,
        });
    }

    /**
     * Given an id, returns the behavior that
     * this id belongs to.
     * @param {String} id
     * @return {Object}
     */
    getBehavior (id) {
        for (let i = 0; i < this.designMap.behavior.length; i++) {
            const entry = this.designMap.behavior[i];

            if (entry.abstractions.includes(id)) {
                return entry;
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

                let varStack;
                let value;

                if (!abstraction.nextVarStack) {
                    console.warn("nextVarStack missing while validating constraints.");
                    continue;
                }

                // Load the relevant varstack based on the instrumented scope
                if (constraint.scope === "local") {
                    varStack = abstraction.nextVarStack[0];
                } else if (constraint.scope === "global") {
                    varStack = abstraction.nextVarStack[1];
                } else {
                    console.warn("Constraint has an invalid scope for the variable");
                    continue;
                }

                if (!varStack || !(constraint.name in varStack)) {
                    console.warn("Variable name is not in stack for constraint validation.");
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
                    this.currentAbstraction = this.abstractionStack[stackSize].value;
                }
            } while (this.abstractionStack.length > 0);

            // check if the entry is in the abstraction.
            this.currentAbstraction.abstractions.forEach((entry, index) => {
                if (entry.id === id) {
                    if ("abstractions" in entry) {
                        // root abstraction with children
                        this.addToExecutionTree(entry, true, abstraction);
                        this.abstractionStack.push({
                            "value": entry,
                        });
                        this.currentAbstraction = entry;
                    } else {
                        // leaf abstraction with no children
                        if (entry.type === "function_call") {
                            this.addToExecutionTree(entry, true, abstraction);
                            this.abstractionStack.push({
                                "parent": entry.target,
                                "value": this.map[entry.target],
                            });
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
        const designAbstraction = this.mapExecutionToFunctionalAbstractions(
            {...abstraction}
        );
        Object.assign(node, this.sdgMeta[node["id"]]);
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
            "designAbstraction": designAbstraction,
        });
        if (this.printTreeToConsole) {
            this.printLevel(this.abstractionStack.length, node.intent);
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
