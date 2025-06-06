
/**
 * This class is store a stack frame.
 */
class StackFrame {
    /**
     * Initializes the stack array.
     * @param {String} type
     * @param {String} uid
     */
    constructor (type, uid) {
        this.stack = [];
        this.uids = [];
        this.type = type;

        if (uid) {
            this.uids.push(uid);
        }
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
     * Adds a new level to the stack with the specified parameters.
     * @param {String} uid
     * @param {Number} position
     * @param {String} statement
     * @param {Boolean} isAsync
     */
    addLevel (uid, position, statement, isAsync) {
        if (!this.hasUid(uid)) {
            this.addUid(uid);
        }

        this.stack.push({
            uid: uid,
            position: position,
            statement: statement,
            isAsync: isAsync,
        });
    }

    /**
     * Removes the most recent level from the stack.
     */
    removeLevel () {
        this.stack.pop();
    }
}

export default StackFrame;
