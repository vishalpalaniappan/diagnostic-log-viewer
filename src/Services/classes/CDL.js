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
 * Header [object]: This object is of type CDL_HEADER and it exposes the
 * logtype map and the source code of the program.
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

        this.callStacks = [];

        this._processBody();
    }

    /**
     * Returns the logtype information at the given position.
     * @param {Number} position Position in the execution array.
     * @return {Object}
     */
    getLogTypeInfoAt (position) {
        const lt = this.execution[position];
        const ltInfo = this.header.logTypeMap[lt];
        return ltInfo;
    }

    /**
     * Returns the logtype information of the function this position belongs to.
     * @param {Number} position Position in the execution array.
     * @return {Object}
     */
    getFunctionLogTypeInfoAt (position) {
        const ltInfo = this.getLogTypeInfoAt(position);
        const parentId = ltInfo.getfId();
        const parentLtInfo = this.header.logTypeMap[parentId];
        return parentLtInfo;
    }

    /**
     * Given a logtype, this function returns log type info about the
     * function it belongs to.
     * @param {Number} lt
     * @return {Object}
     */
    getFunctionOfLogType (lt) {
        const ltInfo = this.header.logTypeMap[lt];
        return ltInfo;
    }

    /**
     * Returns the call stack given a position.
     * @param {Number} position Position in the execution array.
     * @return {Object}
     */
    getCallStack (position) {
        return this.callStacks[position];
    }

    /**
     * Returns the variable stack given a position.
     * @param {Number} position Position in the execution array.
     * @return {Object}
     */
    getVariableStack (position) {
        const variableStack = {};

        const parentId = this.getFunctionLogTypeInfoAt(position).getfId();

        let childLtInfo = this.getLogTypeInfoAt(position);
        let childId = childLtInfo.getId();

        while (childId != parentId && position >= 0) {
            childLtInfo = this.getLogTypeInfoAt(position);
            childId = childLtInfo.getId();

            if (childLtInfo.getfId() === parentId) {
                childLtInfo.getVariables().forEach((variable, index) => {
                    variableStack[variable] = this.variables[position][index];
                });
            }
            position--;
        }
        return variableStack;
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
                    this.callStackFunctions = [this.header.logTypeMap["root"]];
                    this.callStackCallers = [this.header.logTypeMap["root"]];
                    break;
                case LINE_TYPE.EXECUTION:
                    this._processExecutionLog(currLog, index);
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

        const currlt = this.header.logTypeMap[log.lt];

        if (currlt.getType() === "function") {
            const callerLt = this.getLogTypeInfoAt(this.execution.length - 2);
            this.callStackFunctions.push(currlt);
            this.callStackCallers.push(callerLt);
        }

        // Move up the stack until parent function of current log type is found
        const cs = this.callStackFunctions;
        while (!cs[cs.length -1].containsChild(currlt.getId())) {
            this.callStackFunctions.pop();
            this.callStackCallers.pop();
        }

        const callStackIds = [...this.callStackCallers, currlt].map((c) => {
            const functionLtInfo = this.getFunctionOfLogType(c.getfId());
            return [functionLtInfo.getSyntax(), c.getSyntax()];
        });
        this.callStacks.push([...callStackIds]);
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
