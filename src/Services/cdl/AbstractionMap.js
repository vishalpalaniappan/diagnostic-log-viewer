/**
 * This function exposes the abstraction map.
 */
class AbstractionMap {
    /**
     * Loads the map.
     * @param {Object} map
     */
    constructor (map) {
        this.map = map.abstractions;
        console.clear();
        console.log("Created Abstraction Map:", this.map);

        this.abstractionStack = [];
        this.currentAbstraction = null;

        this.executionTree = [];

        // Load the starting position into the abstraction map.
        for (const entry in this.map) {
            if (this.map[entry].start === true) {
                this.abstractionStack.push(this.map[entry]);
                this.currentAbstraction = this.map[entry];
                this.executionTree.push([this.abstractionStack.length, entry.intent]);
            }
        }
    }

    /**
     * Check the current level to see if ID exists.
     * @param {Number} id
     */
    checkCurrentLevel (id) {
        if (this.abstractionStack.length > 0) {
            // Move down the abstraction stack until you find the parent
            do {
                let found = false;
                this.currentAbstraction.abstractions.forEach((abs, index) => {
                    found = (abs.id === id)?true:found;
                });

                if (found) {
                    // If you found the abstraction, you are in the correct
                    // level, so we can exit the loop.
                    break;
                } else {
                    // If you haven't found the abstraction, then move down
                    // the abstraction stack until you find it.
                    this.abstractionStack.pop();
                    const stackSize = this.abstractionStack.length - 1;
                    this.currentAbstraction = this.abstractionStack[stackSize];
                }
            } while (this.abstractionStack.length > 0);

            // Check if the entry is in the abstraction.
            this.currentAbstraction.abstractions.forEach((entry, index) => {
                if (entry.id === id) {
                    if ("abstractions" in entry) {
                        this.printLevel(this.abstractionStack.length, entry.intent);
                        this.executionTree.push([this.abstractionStack.length, entry.intent]);

                        this.abstractionStack.push(entry);
                        this.currentAbstraction = entry;
                    } else {
                        this.printLevel(this.abstractionStack.length, entry.intent);
                        this.executionTree.push([this.abstractionStack.length, entry.intent]);

                        if (entry.type === "function_call") {
                            this.abstractionStack.push(this.map[entry.target]);
                            this.currentAbstraction = this.map[entry.target];
                        }
                    }
                    return;
                }
            });
        };
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
