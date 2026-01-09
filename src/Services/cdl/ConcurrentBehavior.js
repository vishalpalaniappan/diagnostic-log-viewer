/**
 * This class is a representation of the concurrent behavioral
 * metadata. It will be used to move forward in the concurrent
 * abstraction as the forks are assembled. It will essentially
 * hold the state of the concurrent behavior as we step
 * through the behavior of the program.
 */
class ConcurrentBehavior {
    /**
     * Initializes the behavioral meta.
     * @param {Object} concurrentAbstraction
     */
    constructor (concurrentAbstraction) {
        this.concurrentAbstraction = concurrentAbstraction;
        console.log(this.concurrentAbstraction);
    }

    /**
     * Given an abstraction id, this function will
     * move the state of the concurrent abstraction.
     * For example after the start behavior, it will
     * enter the concurrent behavior.
     * @param {String} behaviorId Id of the behavior.
     * @return {Boolean} Inidicate if abstraction finished and we should return;
     */
    moveState (behaviorId) {
        for (let i = 0; i < this.concurrentAbstraction.behaviors.length; i++) {
            const entry = this.concurrentAbstraction.behaviors[i];
            const entryBehaviors = entry.behaviors;

            if (entry.type === "concurrent") {
                if (entryBehaviors[0] === behaviorId) {
                    console.log("Concurrent entry started", behaviorId);
                    // console.log("Entry:", entry.id, entry.type);
                } else if (entryBehaviors[entryBehaviors.length - 1] === behaviorId) {
                    console.log("Concurrent entry finished, I should return");
                    return true;
                }
            } else if (entryBehaviors.includes(behaviorId)) {
                if (entry.type === "start") {
                    console.log("Entry:", entry.id, entry.type);
                } else if (entry.type === "end") {
                    console.log("Entry:", entry.id, entry.type);
                }
            }
        }
        return false;
    }
};

export default ConcurrentBehavior;
