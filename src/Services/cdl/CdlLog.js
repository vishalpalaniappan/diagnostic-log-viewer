import JSON5 from "json5";

import {LINE_TYPE} from "./CDL_CONSTANTS";
import CdlHeader from "./CdlHeader";
import CdlLogLine from "./CdlLogLine";

/**
 *
 */
class CdlLog {
    /**
     * @param {Array} logFile Array containing lines of the log file.
     */
    constructor (logFile) {
        this.logFile = logFile;
        this.execution = [];
        this.exception = null;
        this.header = {};
        this.executionTree = {};

        this.callStacks = {};

        this._processHeader();
        this._processException();
        this._extractCallStack();

        console.log(this.callStacks);
    }


    _processHeader() {
        const firstLog = new CdlLogLine(this.logFile[0]);

        if (firstLog.type === LINE_TYPE.IR_HEADER) {
            this.header = new CdlHeader(firstLog.value);
            this.logFile.shift();
        } else {
            throw new Error("CDL file does not contain a header.")
        }
    }

    _processException() {
        const lastLog = new CdlLogLine(this.logFile[this.logFile.length - 1]);

        if (lastLog.type === LINE_TYPE.EXCEPTION) {
            this.exception = lastLog.value;
            this.logFile.pop();
        }
    }

    /**
     * This function processes each line in the CDL log file.
     * It first classifys the line and extracts its metadata using
     * the CDL_LOG class. Then it adds the metadata to the relevant
     * arrays.
     */
    _extractCallStack () {
        let position = 0;
        let cs = [];
        do {
            const currLog = new CdlLogLine(this.logFile[position]);
            const currLt = this.header.logTypeMap[currLog.lt];

            if (currLog.type === LINE_TYPE.EXECUTION) {            
                if (currLt.isFunction()) {
                    cs.push(currLt.getfId());
                } 

                while (!currLt.isFunction() && cs.length > 0) {
                    if (cs[cs.length - 1] ===  currLt.getfId()) {
                        break;
                    }
                    cs.pop();
                }

                this.callStacks[position] = [...cs];
            }
        } while (++position < this.logFile.length);
    }
}

export default CdlLog;
