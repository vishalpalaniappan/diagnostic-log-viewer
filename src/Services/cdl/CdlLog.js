import JSON5 from "json5";

import {LINE_TYPE} from "./CDL_CONSTANTS";
import CdlHeader from "./CdlHeader";
import CdlLogLine from "./CdlLogLine";

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
 * LogTypeMap [LtInfo]: The keys of this object are the logtype id and
 * the value is an object containing metadata about this logtype from the SST.
 * Examples of metadata are the variable names, line number etc.
 *
 * Header [CdlHeader]: This object is of type CDL_HEADER and it exposes the
 * logtype map and the source code of the program.
 */
class CdlLog {
    /**
     * @param {Array} logFile Array containing lines of the log file.
     */
    constructor (logFile) {
        this.logFile = logFile;
        this.execution = [];
        this.variables = {};
        this.exceptions = {};
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
    getLogTypeInfoAtPosition (position) {
        const lt = this.execution[position];
        const ltInfo = this.header.logTypeMap[lt];
        return ltInfo;
    }

    /**
     * Returns the logtype information of the function this position belongs to.
     * @param {Number} position Position in the execution array.
     * @return {Object}
     */
    getFunctionLogTypeInfoAtPosition (position) {
        const ltInfo = this.getLogTypeInfoAtPosition(position);
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
        const parentId = ltInfo.getfId();
        const parentLtInfo = this.header.logTypeMap[parentId];
        return parentLtInfo;
    }

    /**
     * Returns the call stack given a position.
     * @param {Number} position Position in the execution array.
     * @return {Object}
     */
    getCallStackAtPosition (position) {
        const cs = this.callStacks[position];

        const csInfo = [];

        cs.forEach((position, index) => {
            const currLt = this.getLogTypeInfoAtPosition(position);
            const parent = this.getFunctionLogTypeInfoAtPosition(position);
            const exceptions = this.exceptions[position];
            const info = {};

            if (index === 0) {
                info.functionName = "<module>";
            } else {
                const syntax = parent.getSyntax();
                const functionName = syntax.split("def ")[1].split("(")[0];
                info.functionName = functionName;
            }

            info.fileName = currLt.getFileName();
            info.lineno = currLt.getLineNo();
            info.position = position;
            info.exceptions = exceptions;
            csInfo.push(info);
        });

        return csInfo.reverse();
    }

    /**
     * Returns the exception at the given position.
     * @param {Number} position Position in the execution array.
     * @return {Object}
     */
    getExceptionsAtPosition (position) {
        if (position in this.exceptions) {
            return this.exceptions[position];
        } else {
            return null;
        }
    }

    /**
     * Returns the variable stack given a position.
     * @param {Number} position Position in the execution array.
     * @return {Object}
     */
    getVariableStackAtPosition (position) {
        const variableStack = {};

        const parentId = this.getFunctionLogTypeInfoAtPosition(position).getfId();

        let childLtInfo = this.getLogTypeInfoAtPosition(position);
        let childId = childLtInfo.getId();

        while (childId != parentId && position >= 0) {
            childLtInfo = this.getLogTypeInfoAtPosition(position);
            childId = childLtInfo.getId();

            if (childLtInfo.getfId() === parentId) {
                childLtInfo.getVariables().forEach((variable, index) => {
                    try {
                        variableStack[variable] = JSON5.parse(this.variables[position][index]);
                    } catch (e) {
                        variableStack[variable] = this.variables[position][index];
                    }
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
        let position = 0;
        do {
            const currLog = new CdlLogLine(this.logFile[position]);

            switch (currLog.type) {
                case LINE_TYPE.IR_HEADER:
                    this.header = new CdlHeader(currLog.value);
                    this.callStack = [];
                    break;
                case LINE_TYPE.EXECUTION:
                    this._processExecutionLog(currLog);
                    break;
                case LINE_TYPE.EXCEPTION:
                    position = this._processExceptionLog(currLog, position);
                    break;
                case LINE_TYPE.VARIABLE:
                    this._processVariableLog(currLog);
                    break;
                default:
                    console.error("Invalid CDL line type.");
                    break;
            }

            position++;
        } while (position < this.logFile.length);
    }

    /**
     * Process the execution log statement and extract the call stacks.
     * @param {CdlLogLine} log
     * @param {Number} position
     */
    _processExecutionLog (log) {
        this.execution.push(log.lt);

        const currlt = this.header.logTypeMap[log.lt];
        const position = this.execution.length - 1;

        if (currlt.getType() === "function") {
            this.callStack.push(position);
        }

        const cs = this.callStack;
        if (cs.length > 0) {
            let lt = this.getLogTypeInfoAtPosition(cs[cs.length - 1]);
            while (!lt.containsChild(currlt.getId()) ) {
                cs.pop();
                lt = this.getLogTypeInfoAtPosition(cs[cs.length - 1]);
            }
        }

        const callStackIds = [...this.callStack].map((position) => {
            return position-1;
        });
        callStackIds.push(position);

        this.callStacks.push(callStackIds);
    }

    /**
     * Process the variable log statement. Each variable log line contains
     * metadata about which log type it belongs to. The execution array is
     * traversed backwards until the relevant log type is found.
     * @param {CdlLogLine} log
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
     * @param {CdlLogLine} log
     * @param {Number} position
     * @return {Number}
     */
    _processExceptionLog (log, position) {
        // Group exceptions as it moves down the stack
        const exceptions = [];
        do {
            const currLog = new CdlLogLine(this.logFile[position]);
            if (currLog.type === LINE_TYPE.EXCEPTION) {
                const lt = this.header.logTypeMap[currLog.lt];
                exceptions.push([lt, currLog.value]);
                position++;
            } else {
                break;
            }
        } while (position < this.logFile.length);

        // Find logtype this exception belongs to
        let index = this.execution.length - 1;
        do {
            if (this.execution[index] === log.lt) {
                break;
            }
            index--;
        } while (index > 0);

        // Save exceptions
        const e = this.exceptions;
        e[index] = (index in e)? [...e[index], exceptions]: [exceptions];

        return position - 1;
    }
}

export default CdlLog;
