import CDL_HEADER from "./CDL_HEADER";
import CDL_LOG from "./CDL_LOG";
import {LINE_TYPE} from "./CDL_LOG_CONSTANTS";

/**
 * Given a CDL log file, this class exposes the following:
 *
 * Execution [Array]: This is an array which contains the log types in the
 * order that they appear in the log file.
 *
 * Variables [object]: The keys of this object are the position in the
 * execution array and the value is the variable value.
 *
 * Exception [object]: The keys of this object are the position in the
 * execution array and the value is the exception.
 *
 * LogTypeMap [object]: The keys of this object are the logtype id and
 * the value is an object containing metadata about this logtype from the SST.
 * Examples of metadata are the variable names, line number etc.
 *
 * header [object]: The keys of this object are the file names and the value
 * is the source code for the file.
 *
 * ExecutionTree [object]: This object contains a fully collapsed representation
 * of this log file.
 */
class CDL {
    /**
     * @param {Array} logFile Array containing lines of the log file.
     */
    constructor (logFile) {
        this.logFile = logFile;
        this.execution = [];
        this.variables = {};
        this.exception = {};
        this.header = {};
        this.executionTree = {};

        this.callStack = [];
        this.callStacks = [];

        this._processBody();
    }

    /**
     * This function processes each line in the CDL log file.
     * It first classifys the line and extracts its metadata using
     * the CDL_LOG class. Then it adds the metadata to the relevant
     * arrays.
     */
    _processBody () {
        let index = 0;

        do {
            const currLog = new CDL_LOG(this.logFile[index]);

            switch (currLog.type) {
                case LINE_TYPE.IR_HEADER:
                    this.header = new CDL_HEADER(currLog.value, index);
                    this.callStack.push(this.header.logTypeMap["root"]);
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
        } while (index < this.logFile.length);
    }

    /**
     * Process the execution log statement and extract the call stacks.
     * @param {CDL_LOG} log
     * @param {Number} position
     */
    _processExecutionLog (log, position) {
        this.execution.push(log.lt);

        const lt = this.header.logTypeMap[log.lt];

        if (lt.getType() === "function") {
            this.callStack.push(lt);
        }

        const cs = this.callStack;
        while (!cs[cs.length -1].containsChild(lt.getSyntax())) {
            this.callStack.pop();
        };

        const callStackIds = cs.map((c) => {return c.getId();});
        this.callStacks.push([...callStackIds, lt.getId()]);
    }

    /**
     * Process the variable log statement. Each variable log line contains
     * metadata about which log type it belongs to. The execution array is
     * traversed backwards until the relevant log type is found.
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
     * Processes an exception from log statement. Each exception log line
     * contains metadata about which log type it belongs to. The execution
     * array is traversed backwards until the relevant log type is found.
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
