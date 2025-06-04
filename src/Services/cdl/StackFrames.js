/**
 * This class is used to interact with the stack frames for the program.
 */
class StackFrames {
    /**
     * Initializes the stack array.
     */
    constructor () {
        this.stacks = [];
    }

    /**
     * This function gets a new stack frame.
     * @return {Array}
     */
    getNewStackFrame () {
        const newStack = [];
        this.stacks.push(newStack);
        return newStack;
    }

    /**
     * This function returns a stack frame given a UID.
     */
    getFrameWithUid () {

    }
}

export default StackFrames;
