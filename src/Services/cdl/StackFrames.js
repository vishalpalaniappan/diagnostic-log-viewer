import StackFrame from "./StackFrame";

/**
 * This class is used to manage the stack frames extracted
 * during the programs execution.
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
     * @return {StackFrame}
     */
    getNewStackFrame (uid) {
        const newStack = new StackFrame("sync");
        this.rootFrame = newStack;
        this.stacks.push(newStack);
        if (uid) {
            newStack.addUid(uid);
        }
        return newStack;
    }

    /**
     * This function gets a new async stack frame.
     * @param {String} uid
     * @return {StackFrame}
     */
    getNewAsyncStackFrame (uid) {
        const newStack = new StackFrame("async");
        this.stacks.push(newStack);
        if (uid) {
            newStack.addUid(uid);
        }
        return newStack;
    }

    /**
     * This function returns the root stack frame.
     * @return {StackFrame}
     */
    getRootStackFrame () {
        return this.rootFrame;
    }

    /**
     * This function returns a stack frame given a UID.
     * @param {String} uid
     * @param {Boolean} isAsync
     * @return {StackFrame}
     */
    getFrameWithUid (uid, isAsync) {
        const _stack = this.stacks.find((stack) => stack.hasUid(uid));

        if (_stack) {
            return _stack;
        }

        // No stack was found, so create a new stack and initialize
        // the UID list with the UID.
        if (isAsync) {
            return this.getNewAsyncStackFrame(uid);
        } else {
            return this.getNewStackFrame(uid);
        }
    }
}

export default StackFrames;
