import CdlHeader from "./CdlHeader";
import StackFrames from "./StackFrames";

/**
 * This class processes threads execution and exposes functions to
 * interact with the thread given a position.
 */
class Thread {
    /**
     * @param {Array} logFile Array containing lines of the log file.
     * @param {String} threadId A string containing the thread id.
     */
    constructor (logFile, threadId) {
        this.exception = null;
        this.header = {};
        this.execution = [];
        this.callStacks = {};
        this.globalVariables = {};
        this.threadId = threadId;

        this.stackFrames = new StackFrames();
        this.callStack = this.stackFrames.rootFrame;

        this.inputs = [];
        this.outputs = [];

        this.traces = [];

        this._processLog(logFile);

        // Used to go to the end of the file
        this.lastStatement = this._getLastStatement();
        this.firstStatement = this._getFirstStatement();

        this.currPosition = this.lastStatement;

        console.log(this.traces);
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
                    this.header = new CdlHeader(currLog.header);
                    break;
                case "adli_execution":
                    this._getStackPositions(currLog);
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
     * Convert the logged stack to a list of positions
     * @param {Object} currLog
     */
    _getStackPositions (currLog) {
        let position = this.execution.length - 1;
        this.callStacks[position] = [];

        // Reverse the keys so that we can work backwards to find the positions
        const keys = Object.keys(currLog.stack).reverse();

        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const level = currLog.stack[key];

            if (index == 0) {
                // The top of the stack is the position being inspected
                this.callStacks[this.execution.length - 1].push(position);
                continue;
            };

            const ltInfo = this.header.getLtFromInjectedLineno(level.filename, level.lineno);
            if (ltInfo === null) {
                console.error(`Failed to find log type info for ${level.filename}:${level.lineno} at stack position ${index}`);
                continue;
            }

            while (position > 0) {
                // Move back through execution until stack position is found
                const execLog = this.execution[position];
                if (execLog?.type === "adli_execution" && execLog.value === ltInfo.id) {
                    this.callStacks[this.execution.length - 1].push(position);
                    break;
                }
                position--;
            };
        };

        // Reverse the call stack back to the correct position
        this.callStacks[this.execution.length - 1].reverse();
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
        const funcId = startLog.scope_uid;

        let currPosition = 0;
        do {
            const currLog = this.execution[currPosition];

            if (currLog?.type && currLog.type == "adli_variable") {
                const variable = this.header.variableMap[currLog.varid];
                const varFuncId = currLog.scope_uid;

                if (variable.isTemp) {
                    tempVars[variable.name] = currLog.value;
                } else if ((varFuncId == "global" || variable.isGlobal())) {
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
        this.traces = [];
        cs.forEach((position, index) => {
            if (position) {
                const positionData = this.execution[position];
                const currLt = this.header.logTypeMap[positionData.value];
                const functionLt = this.header.logTypeMap[currLt.getfId()];

                const fName = (currLt.getfId() === 0)?"<module>":functionLt.getFuncName();
                const exception = (position === this.lastStatement)?this.exception:null;
                csInfo.push({
                    threadId: this.threadId,
                    functionName: fName,
                    filePath: currLt.getFilePath(),
                    fileName: currLt.getFileName(),
                    lineno: currLt.getLineNo(),
                    position: position,
                    exceptions: exception,
                });
            }
        });


        this.getVariableTrace(cs[cs.length - 1]);
        console.log(this.traces);

        return csInfo;
    }

    /**
     * Returns the last executed instruction in the program.
     * @param {Number} position
     * @return {Object|null}
     */
    getPositionData (position) {
        position = (position < this.firstStatement)?this.firstStatement:position;
        do {
            const positionData = this.execution[position];
            if (positionData.type === "adli_execution") {
                return {
                    currLtInfo: this.header.logTypeMap[positionData.value],
                    threadId: this.threadId,
                    callStack: this.getCallStackAtPosition(position).reverse(),
                    exceptions: this.exception,
                };
            }
        } while (--position > 0);

        return null;
    }

    /**
     * Returns the last logged statement
     * @return {int}
     */
    _getLastStatement () {
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
    _getFirstStatement () {
        let position = 0;
        do {
            if (this.execution[position].type === "adli_execution") {
                return position;
            }
        } while (++position < this.execution.length);
    }


    /**
     * @param {Number} position
     */
    getVariableTrace (position) {
        const positionData = this.execution[position];
        const currLt = this.header.logTypeMap[positionData.value];

        if (currLt.vars.length > 0 && currLt.deps.length > 0) {
            for (const dep of currLt.deps) {
                this.getTrace(position, dep[0], [currLt.statement], positionData.scope_uid);
            }
        }
    }

    /**
     * Get the trace
     * @param {Number} position
     * @param {String} targetName
     * @param {Array} trace
     * @param {String} uid
     */
    getTrace (position, targetName, trace, uid) {
        do {
            position--;
            const positionData = this.execution[position];
            if (positionData.type == "adli_variable" && positionData.scope_uid === uid) {
                const varInfo = this.header.variableMap[positionData.varid];
                const ltInfo = this.header.logTypeMap[varInfo.logType];

                if (ltInfo.vars.length == 0) {
                    continue;
                }

                const varName = ltInfo.vars[0][0];
                if (varName == targetName) {
                    trace.push(ltInfo.statement);

                    if (ltInfo.deps.length === 0) {
                        this.addTrace(trace);
                    }

                    for (const dep of ltInfo.deps) {
                        this.getTrace(position, dep[0], [...trace], uid);
                    }
                    return;
                }
            }
        } while (position > 0);

        this.addTrace(trace);
    }

    /**
     * Check if array is equal
     * @param {Array} arr1
     * @param {Array} arr2
     * @return {Boolean}
     */
    checkArrayEquality(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
    }

    /**
     *
     * @param {Array} trace
     */
    addTrace (trace) {
        for (const t of this.traces) {
            if (this.checkArrayEquality(t, trace)) {
                return;
            }
        }
        this.traces.push(trace);
    }
}

export default Thread;
