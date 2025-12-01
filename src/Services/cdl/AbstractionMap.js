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
                    console.log(this.map[entry].intent);
                    this.abstractionStack.push(this.map[entry]);
                    this.currentAbstraction = this.map[entry];
                    return;
                }
            }
        }

        if (this.abstractionStack.length > 0) {
            if ("abstractions" in this.currentAbstraction) {
                this.currentAbstraction.abstractions.forEach((entry, index) => {
                    if (entry.id === id) {
                        console.log(entry.intent);
                        this.abstractionStack.push(entry);
                        this.currentAbstraction = entry;
                        return;
                    }
                });
            }
        };
    }
};

export default AbstractionMap;
