import CDL_LOG from "./CDL_LOG";
import {LINE_TYPE} from "./CDL_LOG";

/**
 * Given the log file, this function exposes
 */
class CDL {
    /**
     *
     * @param {*} log
     */
    constructor (log) {
        this.log = log;
        this.execution = [];
        this.variables = {};
        this.exception = {};
        this.fileTree = {};

        this._processBody();
    }

    /**
     * Returns the body of the CDL File
     */
    _processBody () {
        let index = 0;

        do {
            const currLog = new CDL_LOG(this.log[index]);

            switch (currLog.type) {
                case LINE_TYPE.IR_HEADER:
                    this.fileTree = JSON5.parse(currLog.value);
                    break;
                case LINE_TYPE.EXECUTION:
                    this._processExecutionLog(currLog);
                    break;
                case LINE_TYPE.EXCEPTION:
                    this._processExceptionLog(currLog);
                    break;
                case LINE_TYPE.VARIABLE:
                    this._processVariableLog(currLog);
                    break;
                default:
                    console.error("Invalid CDL line type.");
                    break;
            }

            index++;
        } while (index < this.log.length);
    }

    /**
     * Process the execution log statement
     * @param {CDL_LOG} log
     */
    _processExecutionLog (log) {
        this.execution.push(log.lt);
    }

    /**
     * Process the variable log statement
     * @param {CDL_LOG} log
     */
    _processVariableLog (log) {
        let position = this.execution.length - 1;
        do {
            if (this.execution[position] === log.lt) {
                break;
            }
            position--;
        } while (position >= 0);

        const v = this.variables;
        v[position] = (position in v)? [...v[position], log.value]: [log.value];
    }


    /**
     * Processes an exception from log body
     * @param {CDL_LOG} log
     */
    _processExceptionLog (log) {
        let index = this.execution.length - 1;
        do {
            if (this.execution[index] === log.lt) {
                break;
            }
            index--;
        } while (index > 0);

        const e = this.exception;
        e[index] = (index in e)? [...e[index], log.value]: [log.value];
    }
}

export default CDL;
