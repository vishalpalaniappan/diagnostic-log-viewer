
/**
 * This class is store a stack frame.
 */
class StackFrame {
    /**
     * Initializes the stack array.
     * @param {String} type
     */
    constructor (type) {
        this.stack = [];
        this.uids = [];
        this.type = type;
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

    /**
     *
     * @param {String} uid
     * @param {Number} position
     * @param {String} statement
     * @param {Boolean} isAsync
     */
    addLevel (uid, position, statement, isAsync) {
        this.addUid(uid);
        this.stack.push({
            uid: uid,
            position: position,
            statement: statement,
            isAsync: isAsync,
        });
    }

    /**
     *
     */
    removeLevel () {
        this.stack.pop();
    }
}

export default StackFrame;
