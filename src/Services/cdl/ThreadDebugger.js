import clpFfiJsModuleInit from "clp-ffi-js";

import CDL_WORKER_PROTOCOL from "../CDL_WORKER_PROTOCOL";
import {readFile} from "../helper/ReadFile";
import Thread from "./Thread";

/**
 * This class accepts a CDL file object or URL and exposes the functions
 * needed to interact with the program.
 */
class ThreadDebugger {
    /**
     * Loads the CDL file and initializes the debugger state.
     * @param {Array} threadExecution A list containing the execution of
     * each thread.
     */
    constructor (threadExecution) {
        this.cdlFile = new Thread(threadExecution);
    }

    /**
     * This function returns the variable stack at a given position.
     * @param {Number} position
     */
    getVariableStack (position) {
        const [localVariables, globalVariables] = this.cdl.getVariablesAtPosition(position);
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
            args: {
                localVariables: localVariables,
                globalVariables: globalVariables,
            },
        });
    }

    /**
     * This function moves to the start of the file.
     */
    goToStart () {
        this.cdl.getPositionData(this.cdl.firstStatement);
    }

    /**
     * This function moves to the end of the file.
     */
    goToEnd () {
        this.cdl.getPositionData(this.cdl.lastStatement);
    }

    /**
     * This function steps into the next position.
     * @param {Number} position
     */
    stepInto (position) {
        const nextPosition = this.cdl._getNextPosition(position);
        if (nextPosition == null) {
            // End of file has been reached
            return;
        }
        const callStack = this.cdl.getCallStackAtPosition(nextPosition);
        this.cdl.getPositionData(callStack[callStack.length - 1].position);
    }

    /**
     * This function steps out of the current position.
     * @param {Number} position
     */
    stepOut (position) {
        const callStack = this.cdl.getCallStackAtPosition(position);
        if (callStack.length <= 1) {
            return;
        }
        this.cdl.getPositionData(callStack[callStack.length - 2].position);
    }

    /**
     * This function steps over any function calls.
     * @param {Number} position
     */
    stepOverForward (position) {
        const originalStack = this.cdl.getCallStackAtPosition(position);

        while (position < this.cdl.execution.length) {
            position = this.cdl._getNextPosition(position);

            if (position == null) {
                // The end of the file has been reached
                return;
            }

            if (this.cdl.getCallStackAtPosition(position).length <= originalStack.length) {
                this.cdl.getPositionData(position);
                return;
            }
        }
    }

    /**
     * This function steps over any function calls backwards.
     * @param {Number} position
     */
    stepOverBackward (position) {
        const originalStack = this.cdl.getCallStackAtPosition(position);

        while (position >= 0) {
            position = this.cdl._getPreviousPosition(position);

            if (position == null) {
                // Start of file has been reached
                return;
            }

            if (this.cdl.getCallStackAtPosition(position).length <= originalStack.length) {
                this.cdl.getPositionData(position);
                return;
            }
        }
    }
};

export default ThreadDebugger;
