import clpFfiJsModuleInit from "clp-ffi-js";

import CDL_WORKER_PROTOCOL from "../CDL_WORKER_PROTOCOL";
import {readFile} from "../helper/ReadFile";
import CDL from "./CDL";

/**
 * This class accepts a CDL file object or URL and exposes the functions
 * needed to debug the program using the log file.
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
        this.cdl = new CDL(log);
        console.log(this.cdl);
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_METADATA,
            args: {
                fileTree: this.cdl.header.getSourceFiles(),
            },
        });
        const position = this.cdl.execution.length - 1 - 19;
        this.getPositionData(position);
    }

    /**
     *
     * @param {Number} position Position in execution sequence to go to.
     */
    getPositionData (position) {
        const currLt = this.cdl.execution[position];
        const currLtInfo = this.cdl.header.logTypeMap[currLt];

        const callStack = this.cdl.getCallStack(position);
        const exceptions = this.cdl.getExceptions(position);

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
        const variableStack = this.cdl.getVariableStack(position);
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
        if (position < this.cdl.execution.length - 1) {
            this.position = position + 1;
            this.getPositionData(this.position);
        } else {
            console.log("Reached end of file.");
        }
    }

    /**
     * This function steps out the next position.
     * @param {Number} position
     */
    stepOut (position) {
        const callStack = this.cdl.getCallStack(position);
        console.log(callStack);

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
        const parentlt = this.cdl.getFunctionLogTypeInfoAt(position);
        const childIds = parentlt.childIds;

        const lt = this.cdl.getLogTypeInfoAt(position);
        if (lt.getId() === childIds[childIds.length - 1]) {
            this.getPositionData(position + 1);
            return;
        }

        do {
            position++;
            const lt = this.cdl.getLogTypeInfoAt(position);
            if (childIds.includes(lt.getId())) {
                break;
            }
        } while (position < this.cdl.execution.length - 1);
        this.getPositionData(position);
    }

    /**
     * This function steps over any function calls backwards.
     * @param {Number} position
     */
    stepOverBackward (position) {
        const parentlt = this.cdl.getFunctionLogTypeInfoAt(position);
        const childIds = parentlt.childIds;

        const lt = this.cdl.getLogTypeInfoAt(position);
        if (lt.getId() === childIds[0]) {
            this.getPositionData(position - 1);
            return;
        }

        do {
            position--;
            const lt = this.cdl.getLogTypeInfoAt(position);
            if (parentlt.childIds.includes(lt.getId())) {
                break;
            }
        } while (position >= 0);
        this.getPositionData(position);
    }
};

export default Debugger;
