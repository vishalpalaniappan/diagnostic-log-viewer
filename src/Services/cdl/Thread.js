import CdlHeader from "./CdlHeader";
import MapAbstractions from "./MapAbstractions";

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

        this.inputs = [];
        this.outputs = [];

        this._processLog(logFile);

        // Used to go to the end of the file
        this.lastStatement = this._getLastStatement();
        this.firstStatement = this._getFirstStatement();

        this.currPosition = this.lastStatement;
        this.seg = this.generateSeg();
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
                console.error(`Failed to find log type info for ${level.filename}:${level.lineno}\
                     at stack position ${index}`);
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
        } while (++currPosition < position);


        /**
         * Once we reach the position, now we get all the logged variables
         * for this position. This is done to get all the variables for
         * the current abstraction.
         */
        const sdgMeta = this.header.getAbstractionMetadata();
        const abstraction = this.header.logTypeMap[startLog.value];
        const meta = sdgMeta.abstractions[abstraction.abstractionId];
        const variables = (meta.variables)?[...meta.variables]:[];

        while (variables.length > 0 && currPosition < this.execution.length) {
            const currLog = this.execution[currPosition];

            if (currLog?.type && currLog.type == "adli_variable") {
                const variable = this.header.variableMap[currLog.varid];
                const varFuncId = currLog.scope_uid;

                let updated;
                if (variable.isTemp) {
                    tempVars[variable.name] = currLog.value;
                } else if ((varFuncId == "global" || variable.isGlobal())) {
                    this._updateVariable(variable, currLog.value, globalVars, tempVars);
                    updated = true;
                } else if (varFuncId === funcId) {
                    this._updateVariable(variable, currLog.value, localVars, tempVars);
                    updated = true;
                }

                if (updated) {
                    const variableInd = variables.findIndex((v) => v.name === variable.name);
                    if (variableInd !== -1) {
                        variables.splice(variableInd, 1);
                    }
                }
            }
            currPosition++;
        }

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
     * This function processes the execution logs and generates the SEG.
     * @return {null|Object} Returns the semantic execution graph or null.
     */
    generateSeg () {
        if (!this.header.hasAbstractionMetadata()) {
            console.log("Trace file does not have an abstraction map");
            return null;
        }

        const sdgMeta = this.header.getAbstractionMetadata();

        if (!sdgMeta) {
            console.log("Trace file is missing required SDG data or metadata");
            return null;
        }

        const map = new MapAbstractions(sdgMeta);

        let position = 0;
        do {
            const positionData = this.execution[position];
            if (positionData.type === "adli_execution") {
                const abstractionInstance = {...this.header.logTypeMap[positionData.value]};
                const meta = sdgMeta.abstractions[abstractionInstance.abstractionId];
                abstractionInstance.threadId = this.threadId;
                abstractionInstance.position = position;
                abstractionInstance.timestamp = positionData.timestamp;
                abstractionInstance.varStack = this.getVariablesAtPosition(position, meta);
                map.mapCurrentLevel(abstractionInstance);
            }
        } while (++position < this.execution.length);

        // If the program ended in failure, save the exception
        // to the final node in the semantic execution graph
        if (this.exception && map.seg.length > 0) {
            const len = map.seg.length;
            const lastEntry = map.seg[len - 1];
            lastEntry.exception = this.exception;
        }

        return map.seg;
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
}

export default Thread;
