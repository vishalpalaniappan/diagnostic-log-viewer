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
     * @return {Array}
     */
    getNewStackFrame () {
        const newStack = new StackFrame("sync");
        this.stacks.push(newStack);
        return newStack;
    }

    /**
     * This function gets a new stack frame.
     * @return {Array}
     */
    getNewStacAsyncFrame () {
        const newStack = new StackFrame("async");
        this.stacks.push(newStack);
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
     * @return {Object}
     */
    getFrameWithUid (uid) {
        let _stack;
        this.stacks.forEach((stack, index) => {
            if (stack.hasUid(uid)) {
                _stack = stack;
            }
        });

        if (_stack) {
            return _stack;
        } else {
            return this.getNewStackFrame();
        }
    }
}

export default StackFrames;
