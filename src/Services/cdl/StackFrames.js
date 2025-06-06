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
     * This function gets a new stack frame.
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
     * @return {StackFrame}
     */
    getFrameWithUid (uid, isAsync) {
        const _stack = this.stacks.find((stack) => stack.hasUid(uid));

        if (_stack) {
            return _stack;
        }

        if (isAsync) {
            return this.getNewAsyncStackFrame(uid);
        } else {
            return this.getNewStackFrame(uid);
        }
    }
}

export default StackFrames;
