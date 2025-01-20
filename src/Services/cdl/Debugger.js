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
        // this.getPositionData(this.cdl.execution.length - 1);
        this.getPositionData(30);
    }

    /**
     *
     * @param {Number} position Position in execution sequence to go to.
     */
    getPositionData (position) {
        const currLt = this.cdl.execution[position];
        const currLtInfo = this.cdl.header.logTypeMap[currLt];

        const callStack = this.cdl.getCallStackAtPosition(position);
        const exceptions = this.cdl.getExceptionsAtPosition(position);

        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_POSITION_DATA,
            args: {
                currLtInfo: currLtInfo,
                callStack: callStack,
                exceptions: exceptions,
            },
        });
    }

    /**
     * This function returns the variable stack given a position.
     * @param {Number} position
     */
    getVariableStack (position) {
        const variableStack = this.cdl.getVariableStackAtPosition(position);
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK,
            args: {
                variableStack: variableStack,
            },
        });
    }

    /**
     * This function steps into the next position.
     * @param {Number} position
     */
    stepInto (position) {
        if (position + 1 >= this.cdl.execution.length) {
            return;
        }
        const callStack = this.cdl.getCallStackAtPosition(position + 1);
        this.getPositionData(callStack[0].position);
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
        this.getPositionData(callStack[1].position);
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
        const currStack = this.cdl.getCallStackAtPosition(position);

        while (++position < this.cdl.execution.length) {
            const stack = this.cdl.getCallStackAtPosition(position);
            if (currStack.length >= stack.length) {
                this.getPositionData(position);
                return;
            }
        }

        this.getPositionData(originalPosition + 1);
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
        const currStack = this.cdl.getCallStackAtPosition(position);

        while (--position >= 0) {
            const stack = this.cdl.getCallStackAtPosition(position);
            if (currStack.length >= stack.length) {
                this.getPositionData(position);
                return;
            }
        }

        this.getPositionData(originalPosition - 1);
    }
};

export default Debugger;
