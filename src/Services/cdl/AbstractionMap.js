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
        console.log("Created Abstraction Map:", this.map);

        this.abstractionStack = [];
        this.currentAbstraction = null;
    }

    /**
     * Check the current level to see if ID exists.
     * @param {Number} id
     */
    checkCurrentLevel (id) {
        if (this.abstractionStack.length === 0 || id in this.map) {
            for (const entry in this.map) {
                if (entry === id) {
                    this.abstractionStack.push(this.map[entry]);
                    this.currentAbstraction = this.map[entry];
                    this.printLevel(this.abstractionStack.length, this.map[entry].intent);
                    return;
                }
            }
        }

        if (this.abstractionStack.length > 0) {
            // Move down the abstraction stack until you find the parent
            do {
                let found = false;
                this.currentAbstraction.abstractions.forEach((abs, index) => {
                    found = (abs.id === id)?true:found;
                });

                if (found) {
                    break;
                } else {
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
                        this.abstractionStack.push(entry);
                        this.currentAbstraction = entry;
                    } else {
                        this.printLevel(this.abstractionStack.length, entry.intent);
                    }
                    return;
                }
            });
        };
    }

    /**
     *
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
