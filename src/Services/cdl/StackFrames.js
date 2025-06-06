import StackFrame from "./StackFrame";

/**
 * This class is used to interact with the stack frames for the program.
 */
class StackFrames {
    /**
     * Initializes the stack array.
     */
    constructor () {
        this.stacks = [];
        this.rootFrame = new StackFrame("root");
    }

    /**
     * This function gets a new stack frame.
     * @param {String} uid
     * @return {Array}
     */
    getNewStackFrame (uid) {
        const newStack = new StackFrame("sync");
        this.stacks.push(newStack);
        if (uid) {
            newStack.uids.push(uid);
        }
        return newStack;
    }

    /**
     * This function gets a new stack frame.
     * @param {String} uid
     * @return {Array}
     */
    getNewAsyncStackFrame (uid) {
        const newStack = new StackFrame("async");
        this.stacks.push(newStack);
        if (uid) {
            newStack.uids.push(uid);
        }
        return newStack;
    }

    /**
     *
     * @return {StackFrame}
     */
    getRootStackFrame () {
        return this.rootFrame;
    }

    /**
     * This function returns a stack frame given a UID.
     * @param {String} uid
     * @param {Boolean} isAsync
     * @return {Object}
     */
    getFrameWithUid (uid, isAsync) {
        let _stack;
        this.stacks.forEach((stack, index) => {
            if (stack.hasUid(uid)) {
                _stack = stack;
            }
        });

        if (_stack) {
            return _stack;
        } else {
            if (isAsync) {
                return this.getNewAsyncStackFrame(uid);
            } else {
                return this.getNewStackFrame(uid);
            }
        }
    }
}

export default StackFrames;
