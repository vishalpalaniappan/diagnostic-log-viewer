
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
        this.currentAbstraction = [];
    }
};

export default AbstractionMap;
