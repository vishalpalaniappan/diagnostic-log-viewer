import clpFfiJsModuleInit from "clp-ffi-js";

import CDL_WORKER_PROTOCOL from "../CDL_WORKER_PROTOCOL";
import {readFile} from "../helper/ReadFile";
import CdlLog from "./CdlLog";

/**
 * This class accepts a CDL file object or URL and exposes the functions
 * needed to interact with the program.
 */
class Debugger {
    /**
     * Loads the CDL file and initializes the debugger state.
     * @param {File|String} cdlFile File object or URL of CDL log file.
     */
    constructor (cdlFile) {
        readFile(cdlFile).then(async (data) => {
            const module = await clpFfiJsModuleInit();
            const streamReader = new module.ClpStreamReader(data, {});
            const log = streamReader.decodeRange(0, streamReader.deserializeStream(), false);
            this.parseLogAndInitializeDebugger(log);
        });
    }

    /**
     * This function parses the CDL log file and intializes debugger state.
     * @param {Array} log Contents of decompressed CDL log file.
     */
    parseLogAndInitializeDebugger (log) {
        this.cdl = new CdlLog(log);
        console.info(this.cdl);
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_METADATA,
            args: {
                fileTree: this.cdl.header.getSourceFiles(),
            },
        });
        this.cdl.getPositionData(this.cdl.execution.length - 1);
    }

    /**
     * This function returns the variable stack given a position.
     * @param {Number} position
     */
    getVariableStack (position) {
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
            args: {
                variableStack: this.cdl.getVariablesAtPosition(position),
            },
        });
    }

    /**
     * This function moves to the end of the file.
     */
    goToStart () {
        this.cdl.getPositionData(0);
    }

    /**
     * This function moves to the start of the file.
     */
    goToEnd () {
        this.cdl.getPositionData(this.cdl.execution.length - 1);
    }

    /**
     * This function steps into the next position.
     * @param {Number} position
     */
    stepInto (position) {
        if (position + 1 >= this.cdl.execution.length) {
            return;
        }
        const nextPosition = this.cdl._getNextPosition(position);
        const callStack = this.cdl.getCallStackAtPosition(nextPosition);
        this.cdl.getPositionData(callStack[0].position);
    }

    /**
     * This function steps out the next position.
     * @param {Number} position
     */
    stepOut (position) {
        const callStack = this.cdl.getCallStackAtPosition(position);
        if (callStack.length <= 1) {
            return;
        }
        this.cdl.getPositionData(callStack[1].position);
    }

    /**
     * This function steps over any function calls.
     * @param {Number} position
     */
    stepOverForward (position) {
        if (position + 1 >= this.cdl.execution.length) {
            return;
        }

        const originalPosition = position;
        const stack = this.cdl.getCallStackAtPosition(position);

        while (position < this.cdl.execution.length) {
            position = this.cdl._getNextPosition(position);
            const currStack = this.cdl.getCallStackAtPosition(position);
            if (stack.length >= currStack.length) {
                this.cdl.getPositionData(position);
                return;
            }
        }

        this.cdl.getPositionData(
            this.cdl._getNextPosition(originalPosition)
        );
    }

    /**
     * This function steps over any function calls backwards.
     * @param {Number} position
     */
    stepOverBackward (position) {
        if (position - 1 < 0) {
            return;
        }

        const originalPosition = position;
        const stack = this.cdl.getCallStackAtPosition(position);

        while (position >= 0) {
            position = this.cdl._getPreviousPosition(position);
            const currStack = this.cdl.getCallStackAtPosition(position);
            if (stack.length >= currStack.length) {
                this.cdl.getPositionData(position);
                return;
            }
        }

        this.cdl.getPositionData(
            this.cdl._getPreviousPosition(originalPosition)
        );
    }
};

export default Debugger;
