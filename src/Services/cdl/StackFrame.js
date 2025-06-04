
/**
 * This class is store a stack frame.
 */
class StackFrame {
    /**
     * Initializes the stack array.
     */
    constructor () {
        this.stack = [];
        this.uids = [];
    }

    /**
     * Add a UID to the list.
     * @param {String} uid
     */
    addUid (uid) {
        this.uids.push(uid);
    }

    /**
     * Checks if the UID has been visited
     * in this stack frame.
     * @param {String} uid
     * @return {Boolean}
     */
    hasUid (uid) {
        return this.uids.includes(uid);
    }
}

export default StackFrame;
