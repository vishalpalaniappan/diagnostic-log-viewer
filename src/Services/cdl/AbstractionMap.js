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
                    console.log("FUNCTION CALL");
                    this.abstractionStack.push(this.map[entry]);
                    this.currentAbstraction = this.map[entry];
                    console.log(this.abstractionStack.length + "," + id + ":" + this.map[entry].intent);
                    return;
                }
            }
        }

        if (this.abstractionStack.length > 0) {
            do {
                let found = false;
                this.currentAbstraction.abstractions.forEach((abs, index) => {
                    if (abs.id === id) {
                        found = true;
                    }
                });

                if (found) {
                    break;
                } else {
                    this.abstractionStack.pop();
                    const stackSize = this.abstractionStack.length - 1;
                    this.currentAbstraction = this.abstractionStack[stackSize];
                }
            } while (this.abstractionStack.length > 0);

            if (this.currentAbstraction && "abstractions" in this.currentAbstraction) {
                this.currentAbstraction.abstractions.forEach((entry, index) => {
                    if (entry.id === id) {
                        if ("abstractions" in entry) {
                            console.log(this.abstractionStack.length + "," + id + ":" + entry.intent);
                            this.abstractionStack.push(entry);
                            this.currentAbstraction = entry;
                        } else {
                            console.log(this.abstractionStack.length + "," + id + ":" + entry.intent);
                        }
                        return;
                    }
                });
            }
        };
    }
};

export default AbstractionMap;
