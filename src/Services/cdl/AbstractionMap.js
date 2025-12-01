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
        if (this.abstractionStack.length === 0) {
            for (const entry in this.map) {
                if (entry === id) {
                    this.abstractionStack.push(this.map[entry]);
                    this.currentAbstraction = this.map[entry];
                    return;
                }
            }
        }
    }
};

export default AbstractionMap;
