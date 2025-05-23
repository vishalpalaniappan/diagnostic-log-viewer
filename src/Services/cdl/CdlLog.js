import CDL_WORKER_PROTOCOL from "../CDL_WORKER_PROTOCOL";
import CdlHeader from "./CdlHeader";

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
        this.traceEvents = [];

        this.inputs = [];
        this.outputs = [];

        this._processLog(logFile);

        // Used to go to the end of the file
        this.lastStatement = this.getLastStatement();
        this.firstStatement = this.getFirstStatement();
    }

    /**
     * Processes the log file one line at a time.
     * @param {Array} logFile
     */
    _processLog (logFile) {
        let position = 0;
        do {
            const log = logFile[position];

            const currLog = log["user-generated"];
            currLog["timestamp"] = log["auto-generated"]["timestamp"];
            currLog["level"] = log["auto-generated"]["level"];

            this.execution.push(currLog);

            switch (currLog.type) {
                case "adli_header":
                    this.header = new CdlHeader(JSON.parse(currLog.header));
                    break;
                case "adli_execution":
                    this._addToCallStacks(currLog);
                    break;
                case "adli_variable":
                    this._saveGlobalVariables(currLog);
                    break;
                case "adli_exception":
                    this.exception = currLog.value;
                    break;
                case "adli_input":
                    this.inputs.push(currLog.value);
                    break;
                case "adli_output":
                    this.outputs.push(currLog.value);
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
        const currLt = this.header.logTypeMap[currLog.value];
        const cs = this.callStack;

        if (currLt.isFunction() && currLt.getfId() != 0) {
            cs.push(position);
        }

        while (cs.length > 0) {
            const currFunctionPosition = cs[cs.length - 1];
            if (this.execution[currFunctionPosition].value === currLt.getfId()) {
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

        if (_varLt.getfId() === 0) {
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
     * @param {Array} variable
     * @param {Object} value
     * @param {Object} varStack
     * @param {Object} tempStack
     */
    _updateVariable (variable, value, varStack, tempStack) {
        if (variable.keys.length == 0) {
            varStack[variable.name] = value;
        } else {
            const currVal = variable.name in varStack ?
                Object.assign({}, varStack[variable.name]) : {};

            let temp = currVal;
            for (let i = 0; i < variable.keys.length; i++) {
                const key = variable.keys[i];

                let newKey;
                if (key.type === "variable") {
                    newKey = varStack[key.value];
                } else if (key.type === "temp_variable") {
                    newKey = tempStack[key.value];
                } else {
                    newKey = key.value;
                }

                if (!(newKey in temp) || typeof temp[newKey] !== "object") {
                    temp[newKey] = {};
                }

                if (i === variable.keys.length - 1) {
                    if (Array.isArray(value)) {
                        temp[newKey] = [...value];
                    } else if (value !== null && typeof value == "object") {
                        temp[newKey] = Object.assign({}, value);
                    } else {
                        temp[newKey] = value === null || value === undefined ?
                            value : value.valueOf();
                    }
                } else {
                    temp = temp[newKey];
                }
            }
            varStack[variable.name] = Object.assign({}, currVal);
        }
    }

    /**
     * Returns the variables in the current function given a starting position.
     * @param {Number} position
     * @return {Object} Returns the variables belonging to current function.
     */
    getVariablesAtPosition (position) {
        const localVars = {};
        const globalVars = {};
        const tempVars = {};
        const startLog = this.execution[position];
        const funcId = this.header.logTypeMap[startLog.value].getfId();

        let currPosition = 0;
        do {
            const currLog = this.execution[currPosition];

            if (currLog?.type && currLog.type == "adli_variable") {
                const variable = this.header.variableMap[currLog.varid];
                const varFuncId = this.header.logTypeMap[variable.logType].getfId();

                if (variable.isTemp) {
                    tempVars[variable.name] = currLog.value;
                } else if ((varFuncId == 0 || variable.isGlobal())) {
                    this._updateVariable(variable, currLog.value, globalVars, tempVars);
                } else if (varFuncId === funcId) {
                    this._updateVariable(variable, currLog.value, localVars, tempVars);
                }
            }
        } while (++currPosition <= position);

        return [localVars, globalVars];
    }

    /**
     * Returns the previous position with an execution log type.
     * @param {Number} position
     * @return {null|int}
     */
    _getPreviousPosition (position) {
        while (--position >= 0) {
            const line = this.execution[position];
            if (line.type === "adli_execution") {
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
            if (line.type === "adli_execution") {
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
            if (position) {
                const positionData = this.execution[position];
                const currLt = this.header.logTypeMap[positionData.value];
                const functionLt = this.header.logTypeMap[currLt.getfId()];

                const fName = (currLt.getfId() === 0)?"<module>":functionLt.getFuncName();
                const exception = (position === this.lastStatement)?this.exception:null;
                csInfo.push({
                    functionName: fName,
                    filePath: currLt.getFilePath(),
                    fileName: currLt.getFileName(),
                    lineno: currLt.getLineNo(),
                    position: position,
                    exceptions: exception,
                });
            }
        });
        return csInfo;
    }

    /**
     * Returns the last executed instruction in the program.
     * @param {Number} position
     */
    getPositionData (position) {
        position = (position < this.firstStatement)?this.firstStatement:position;
        do {
            const positionData = this.execution[position];
            if (positionData.type === "adli_execution") {
                postMessage({
                    code: CDL_WORKER_PROTOCOL.GET_POSITION_DATA,
                    args: {
                        currLtInfo: this.header.logTypeMap[positionData.value],
                        callStack: this.getCallStackAtPosition(position).reverse(),
                        exceptions: this.exception,
                    },
                });
                break;
            }
        } while (--position > 0);
    }

    /**
     * Returns the last logged statement
     * @return {int}
     */
    getLastStatement () {
        let position = this.execution.length - 1;
        do {
            if (this.execution[position].type === "adli_execution") {
                return position;
            }
        } while (--position >= 0);
    }


    /**
     * Returns the first logged statement
     * @return {int}
     */
    getFirstStatement () {
        let position = 0;
        do {
            if (this.execution[position].type === "adli_execution") {
                return position;
            }
        } while (++position < this.execution.length);
    }
}

export default CdlLog;
