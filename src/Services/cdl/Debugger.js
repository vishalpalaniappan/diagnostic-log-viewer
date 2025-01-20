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
        this.getPositionData(this.cdl.execution.length - 1);
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
        /* TODO: Reimplement step over functions, there is a more efficient
        way to implement this.*/
        const parentlt = this.cdl.getFunctionLogTypeInfoAtPosition(position);
        const childIds = parentlt.childIds;
        const lt = this.cdl.getLogTypeInfoAtPosition(position);

        /* If parent is the root node or its the last instruction in the
           function then go to the next position. */
        if (parentlt.getId() === 0 || lt.getId() === childIds[childIds.length - 1]) {
            this.getPositionData(position + 1);
            return;
        }

        let scanPosition = position;
        do {
            scanPosition++;
            const lt = this.cdl.getLogTypeInfoAtPosition(scanPosition);
            if (childIds.includes(lt.getId())) {
                break;
            }
        } while (scanPosition < this.cdl.execution.length - 1);

        if (scanPosition === this.cdl.execution.length - 1) {
            this.getPositionData(position + 1);
        } else {
            this.getPositionData(scanPosition);
        }
    }

    /**
     * This function steps over any function calls backwards.
     * @param {Number} position
     */
    stepOverBackward (position) {
        /* TODO: Reimplement step over functions, there is a more efficient
        way to implement this.*/
        const parentlt = this.cdl.getFunctionLogTypeInfoAtPosition(position);
        const childIds = parentlt.childIds;

        const lt = this.cdl.getLogTypeInfoAtPosition(position);
        if (lt.getId() === childIds[0]) {
            this.getPositionData(position - 1);
            return;
        }

        let scanPosition = position;
        do {
            scanPosition--;
            const lt = this.cdl.getLogTypeInfoAtPosition(scanPosition);
            if (parentlt.childIds.includes(lt.getId())) {
                break;
            }
        } while (scanPosition >= 0);

        if (scanPosition === 0) {
            this.getPositionData(position - 1);
        } else {
            this.getPositionData(scanPosition);
        }
    }
};

export default Debugger;
