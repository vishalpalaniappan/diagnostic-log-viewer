import CDL_WORKER_PROTOCOL from "../CDL_WORKER_PROTOCOL";
import {LINE_TYPE} from "./CDL_CONSTANTS";
import CdlHeader from "./CdlHeader";
import CdlLogLine from "./CdlLogLine";

/**
 * This class processes a CDL log file and exposes functions to 
 * interact with the log file given a starting position.
 */
class CdlLog {
    /**
     * @param {Array} logFile Array containing lines of the log file.
     */
    constructor (logFile) {
        this.exception = null;
        this.header = {};
        this.execution = [];
        this.callStacks = {};
        this.callStack = [];
        this.globalVariables = {};

        this._processLog(logFile);

        // Used to go to the end of the file
        this.lastPosition = this.getLastPosition();
    }

    /**
     * Processes the log file one line at a time.
     * @param {Array} logFile
     */
    _processLog (logFile) {
        let position = 0;
        do {
            const currLog = new CdlLogLine(logFile[position]);
            switch (currLog.type) {
                case LINE_TYPE.EXECUTION:
                    this.execution.push(currLog);
                    this._addToCallStacks(currLog);
                    break;
                case LINE_TYPE.VARIABLE:
                    this.execution.push(currLog);
                    this._saveGlobalVariables(currLog);
                    break;
                case LINE_TYPE.IR_HEADER:
                    this.header = new CdlHeader(currLog.value);
                    break;
                case LINE_TYPE.EXCEPTION:
                    this.exception = currLog.value;
                    break;
                default:
                    break;
            }
        } while (++position < logFile.length);
    }


    /**
     * Add to call stack while processing execution log.
     * @param {CdlLogLine} currLog
     * @param {Number} position
     */
    _addToCallStacks (currLog) {
        const position = this.execution.length - 1;
        const currLt = this.header.logTypeMap[currLog.lt];
        const cs = this.callStack;

        if (currLt.isFunction() && currLt.getfId() != 0) {
            cs.push(position);
        }

        while (cs.length > 0) {
            const currFunctionPosition = cs[cs.length - 1];
            if (this.execution[currFunctionPosition].lt === currLt.getfId()) {
                break;
            }
            cs.pop();
        }

        this.callStacks[position] = cs.map((position, index) => {
            return this._getPreviousPosition(position);
        });
        this.callStacks[position].push(position);
    }

    /**
     * Save global variables while processing the log file.
     * @param {Object} currLog
     */
    _saveGlobalVariables (currLog) {
        const _var = this.header.variableMap[currLog.varid];
        const _varLt = this.header.logTypeMap[_var.logType];

        // Save the first variable value since we are scanning backwards.
        if (_varLt.getfId() === 0 && !(_var.name in this.globalVariables)) {
            this.globalVariables[_var.name] = currLog.value;
        }
    }

    /**
     * Given an array of keys, the stack is updated with the value.
     *
     * Ex: keys:['a','b','c'] stack:{} value:10
     *
     * {'a': {'b': {'c': 10} } }
     *
     *
     * @param {Array} keys
     * @param {Object} newStack
     * @param {Object|String|Number} value
     * @param {Object} existingStack
     * @param {Object} existingTempStack
     */
    _updateVariable (keys, newStack, value, existingStack, existingTempStack) {
        if (keys.length === 1) {
            const key = keys[0];
            if (key.type === "variable") {
                newStack[existingStack[key.value]] = value;
            } else if (key.type === "temp_variable") {
                newStack[existingTempStack[key.value]] = value;
            } else {
                newStack[key.value] = value;
            }
            return;
        }

        const key = keys.shift();
        let newKey;
        if (key.type === "variable") {
            newKey = existingStack[key.value];
            newStack[newKey] = {};
        } else if (key.type === "temp_variable") {
            newKey = existingTempStack[key.value];
            newStack[newKey] = {};
        } else {
            newKey = key.value;
            newStack[newKey] = {};
        }

        this._updateVariable(
            keys, newStack[newKey], value, existingStack, existingTempStack
        );

        return;
    }

    /**
     * Returns the variables in the current function given a starting position.
     * @param {Number} position
     * @return {Object} Returns the variables belonging to current function.
     */
    getVariablesAtPosition (position) {
        const localVariables = {};
        const globalVariables = {};
        const tempVariables = {};
        const startLog = this.execution[position];
        const funcId = this.header.logTypeMap[startLog.lt].getfId();

        let currPosition = 0;
        do {
            const currLog = this.execution[currPosition];

            if (currLog.type === LINE_TYPE.VARIABLE) {
                const variable = this.header.variableMap[currLog.varid];
                const varFuncId = this.header.logTypeMap[variable.logType].getfId();

                if (variable.isTemp) {
                    tempVariables[variable.name] = currLog.value;
                } else if ((varFuncId == 0 || variable.isGlobal())) {
                    // Global Variables
                    if (variable.keys.length == 0) {
                        globalVariables[variable.name] = currLog.value;
                    } else {
                        const currVal = Object.assign({}, globalVariables[variable.name]);
                        const val = JSON.parse(JSON.stringify(currLog.value));
                        this._updateVariable(
                            variable.keys.slice(), currVal, val, globalVariables, tempVariables
                        );
                        globalVariables[variable.name] = currVal;
                    }
                } else if (varFuncId === funcId) {
                    // Local Variables
                    if (variable.keys.length == 0) {
                        localVariables[variable.name] = currLog.value;
                    } else {
                        const currVal = Object.assign({}, localVariables[variable.name]);
                        const val = JSON.parse(JSON.stringify(currLog.value));
                        this._updateVariable(
                            variable.keys.slice(), currVal, val, localVariables, tempVariables
                        );
                        localVariables[variable.name] = currVal;
                    }
                }
            }
        } while (++currPosition <= position);

        return [localVariables, globalVariables];
    }

    /**
     * Returns the previous position with an execution log type.
     * @param {Number} position
     * @return {null|int}
     */
    _getPreviousPosition (position) {
        while (--position >= 0) {
            const line = this.execution[position];
            if (line.type === LINE_TYPE.EXECUTION) {
                return position;
            }
        }
        return null;
    }

    /**
     * Returns the next position wth an execution log type.
     * @param {Number} position
     * @return {null|int}
     */
    _getNextPosition (position) {
        while (++position < this.execution.length) {
            const line = this.execution[position];
            if (line.type === LINE_TYPE.EXECUTION) {
                return position;
            }
        }
        return null;
    }


    /**
     * Gets the call stack at a given position.
     * @param {Number} position
     * @return {object}
     */
    getCallStackAtPosition (position) {
        const cs = this.callStacks[position];
        const csInfo = [];
        cs.forEach((position, index) => {
            const positionData = this.execution[position];
            const currLt = this.header.logTypeMap[positionData.lt];
            const functionLt = this.header.logTypeMap[currLt.getfId()];

            const fName = (currLt.getfId() === 0)?"<module>":functionLt.getFuncName();
            const exception = (position === this.execution.length - 1)?this.exception:null;
            csInfo.push({
                functionName: fName,
                filePath: currLt.getFilePath(),
                fileName: currLt.getFileName(),
                lineno: currLt.getLineNo(),
                position: position,
                exceptions: exception,
            });
        });
        return csInfo;
    }

    /**
     * Returns the last executed instruction in the program.
     * @param {Number} position
     */
    getPositionData (position) {
        do {
            const positionData = this.execution[position];

            if (positionData.type === LINE_TYPE.EXECUTION) {
                postMessage({
                    code: CDL_WORKER_PROTOCOL.GET_POSITION_DATA,
                    args: {
                        currLtInfo: this.header.logTypeMap[positionData.lt],
                        callStack: this.getCallStackAtPosition(position).reverse(),
                        exceptions: this.exception,
                    },
                });
                break;
            }
        } while (--position > 0);
    }

    /**
     * Returns the last position with an execution log type
     * @return {int}
     */
    getLastPosition () {
        let position = this.execution.length - 1;
        do {
            if (this.execution[position].type === LINE_TYPE.EXECUTION) {
                return position;
            }
        } while (--position >= 0);
    }
}

export default CdlLog;
