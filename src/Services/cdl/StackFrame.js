
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
}

export default StackFrame;
