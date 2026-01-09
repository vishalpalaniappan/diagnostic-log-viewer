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
     * @param {Object} behavior
     */
    constructor (behavior) {
        this.behavior = behavior;
    }

    /**
     * Given an abstraction id, this function will
     * move the state of the concurrent abstraction.
     * For example after the start behavior, it will
     * enter the concurrent behavior.
     * @param {String} behaviorId Id of the behavior.
     */
    moveState (behaviorId) {
        console.log("Moving state:", behaviorId);
    }
};

export default ConcurrentBehavior;
