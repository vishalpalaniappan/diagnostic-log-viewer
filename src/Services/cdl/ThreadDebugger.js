import Thread from "./Thread";

/**
 * This class allows use the user to perform debugging operations
 * on a given thread.
 */
class ThreadDebugger {
    /**
     * Creates a thread object using the threadExecution list.
     * @param {Array} threadExecution A list containing the execution of
     * @param {String} threadId A string containing the thread id each thread.
     */
    constructor (threadExecution, threadId) {
        this.thread = new Thread(threadExecution, threadId);
        this.position = this.thread.lastStatement;
    }

    /**
     * This function returns the position data for the current
     * position.     *
     * @return {Object}
     */
    getStack () {
        return this.thread.getPositionData(this.position);
    }

    /**
     * This function returns the variable stack for the given position.     *
     * @param {Number} position
     * @return {Object}
     */
    getVariables (position) {
        return this.thread.getVariablesAtPosition(position);
    }

    /**
     * This function updates the position of the thread.
     * @param {Number} position
     */
    goToPosition (position) {
        this.position = position;
    }

    /**
     * This function goes to the start of the program.
     */
    goToStart () {
        this.position = this.thread.firstStatement;
    }

    /**
     * This function goes to the end of the program.
     */
    goToEnd () {
        this.position = this.thread.lastStatement;
    }

    /**
     * This function steps into the next position.
     * @param {Number} position
     */
    stepInto (position) {
        const nextPosition = this.thread._getNextPosition(position);
        if (nextPosition == null) {
            // End of file has been reached
            return;
        }
        const callStack = this.thread.getCallStackAtPosition(nextPosition);
        this.position = callStack[callStack.length - 1].position;
    }

    /**
     * This function steps out of the current position.
     * @param {Number} position
     */
    stepOut (position) {
        if (this.thread.executionTree) {
            // Use execution tree instead of stack
            const index = this.thread.executionTree.findIndex(
                (item) => item.position === position
            );
            const entry = this.thread.executionTree[index];
            const level = entry.level;
            for (let i = index - 1; i > 0; i--) {
                const entry = this.thread.executionTree[i];
                if (entry.level < level) {
                    this.position = entry.position;
                    break;
                }
            }
        } else {
            const callStack = this.thread.getCallStackAtPosition(position);
            if (callStack.length <= 1) {
                return;
            }
            this.position = callStack[callStack.length - 2].position;
        }
    }

    /**
     * This function steps over any function calls forwards.
     * @param {Number} position
     */
    stepOverForward (position) {
        if (this.thread.executionTree) {
            // Use execution tree instead of stack
            const index = this.thread.executionTree.findIndex(
                (item) => item.position === position
            );
            const entry = this.thread.executionTree[index];
            const level = entry.level;
            const length = this.thread.executionTree.length;

            for (let i = index + 1; i < length - 1; i++) {
                const entry = this.thread.executionTree[i];
                if (entry.level <= level) {
                    this.position = entry.position;
                    break;
                }
            }
        } else {
            const originalStack = this.thread.getCallStackAtPosition(position);

            while (position < this.thread.execution.length) {
                position = this.thread._getNextPosition(position);

                if (position == null) {
                    // The end of the file has been reached
                    return;
                }

                const currStackSize = this.thread.getCallStackAtPosition(position).length;
                if (currStackSize <= originalStack.length) {
                    this.position = position;
                    return;
                }
            }
        }
    }

    /**
     * This function steps over any function calls backwards.
     * @param {Number} position
     */
    stepOverBackward (position) {
        if (this.thread.executionTree) {
            // Use execution tree instead of stack
            const index = this.thread.executionTree.findIndex(
                (item) => item.position === position
            );
            const entry = this.thread.executionTree[index];
            const level = entry.level;
            for (let i = index - 1; i > 0; i--) {
                const entry = this.thread.executionTree[i];
                if (entry.level <= level) {
                    this.position = entry.position;
                    break;
                }
            }
        } else {
            const originalStack = this.thread.getCallStackAtPosition(position);

            while (position >= 0) {
                position = this.thread._getPreviousPosition(position);

                if (position == null) {
                    // Start of file has been reached
                    return;
                }

                const currStackSize = this.thread.getCallStackAtPosition(position).length;
                if (currStackSize <= originalStack.length) {
                    this.position = position;
                    return;
                }
            }
        }
    }
};

export default ThreadDebugger;
