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

        this._processLog(logFile);

        // Used to go to the end of the file
        this.lastStatement = this._getLastStatement();
        this.firstStatement = this._getFirstStatement();

        this.currPosition = this.lastStatement;
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
                const callStack = this.getCallStackAtPosition(position).reverse();

                // let abstractions = this.getExecutionArray(position);
                // const levels =
                // this.header.header.abstraction_info_map.num_levels;

                // for (let level = 2; level <= levels; level++) {
                //     abstractions = this.getExecutionLevel(
                // abstractions, level
                // );
                //     console.log(abstractions);
                // }
                this.getExecutionSequence(callStack);

                return {
                    currLtInfo: this.header.logTypeMap[positionData.value],
                    threadId: this.threadId,
                    callStack: callStack,
                    exceptions: this.exception,
                    designExecutionTree: {},
                    designFlow: [],
                };
            }
        } while (--position > 0);

        return null;
    }


    /**
     * 
     * @param {Object} callstack
     */
    getExecutionSequence (callstack) {
        for (let i = 0; i < callstack.length; i++) {
            const csEntry = callstack[i];
            csEntry.abstractions = [];
            const positionData = this.execution[csEntry.position];
            let ltInfo = this.header.logTypeMap[positionData.value];
            const funcId = ltInfo.getfId();
            let position = csEntry.position;

            const abs = this.header.header.abstraction_info_map["abstractions"];
            const functions = this.header.header.abstraction_info_map["functions"];
            const funcAbstraction = functions[csEntry.functionName];
            csEntry.intent = funcAbstraction.intent;

            do {
                const posData = this.execution[position];
                if (posData.type === "adli_execution") {
                    ltInfo = this.header.logTypeMap[posData.value];

                    if (funcId == ltInfo.getfId()) {
                        const abstractionMeta = abs[ltInfo.id];
                        csEntry.abstractions.push(abstractionMeta.intent);
                    }
                };
            } while (--position > 0 && ltInfo.id != funcId);
        }
    }

    /**
     * Returns the execution array up to a given position.
     * @param {Number} position Position in the execution array.
     * @return {Array}
     */
    getExecutionArray (position) {
        const levelExecution = this.header.header.abstraction_info_map["level_1"];
        const executionArray = [];
        do {
            const positionData = this.execution[position];
            if (positionData.type === "adli_execution") {
                const ltInfo = this.header.logTypeMap[positionData.value];
                executionArray.push(
                    {
                        position: position,
                        key: ltInfo.id,
                        intent: levelExecution[ltInfo.id].intent,
                    }
                );
            }
        } while (--position >= 0);
        return executionArray.reverse();
    }


    /**
     * Gets the execution level 1 given a position.
     * @param {Array} executionArray Position
     * @param {Number} level Level
     * @return {Array}
     */
    getExecutionLevel (executionArray, level) {
        const levelExecution = this.header.header.abstraction_info_map["level_" + level];

        const newAbstractions = [];
        let pos = 0;
        do {
            console.log(executionArray[pos]);
            const abstraction = executionArray[pos].key;

            for (const key of Object.keys(levelExecution)) {
                const entry = levelExecution[key];
                if ("path" in entry && entry.path[0] == abstraction) {
                    const pathString = entry.path.join("");

                    if (pos + entry.path.length <= executionArray.length) {
                        const execPath = executionArray.slice(pos, pos + entry.path.length);
                        const execPathString = execPath.map((obj) => obj.key).join("");

                        if (pathString === execPathString) {
                            console.log("Found level", level, "abstraction:", entry.intent);
                            newAbstractions.push(
                                {
                                    position: pos,
                                    key: key,
                                    level: level,
                                    _intent: entry.intent,
                                    children: execPath,
                                }
                            );
                            pos = pos + entry.path.length - 1;
                            break;
                        }
                    }
                } else if ("world" in entry) {
                    console.log("World:", entry);
                    return {
                        _intent: entry.intent,
                        level: level,
                        children: executionArray,
                    };
                }
            }
        } while (++pos < executionArray.length);

        return newAbstractions;
    }


    /**
     * Given a abstraction metadata and position, replaces the placeholders
     * in the intention string to create a specific intention.
     *
     * @param {Object} abstractionMetadata Metadata of the abstraction.
     * @param {String} intent Intent to be updated.
     * @param {Number} position Position of the intention in the file.
     * @return {String}
     */
    replacePlaceholdersInIntent(abstractionMetadata, intent, position) {
        const variables = abstractionMetadata.variables;
        if (!variables || variables.length == 0) {
            return abstractionMetadata.intent;
        }

        const positionVars = this.getVariablesAtPosition(position);

        console.log(positionVars);

        let updatedIntent = intent;

        console.log("Updating intent:", abstractionMetadata.intent);
        variables.forEach((variable) => {
            const scope = variable.scope;

            if (scope === "local") {
                variable.value = positionVars[0][variable.name];
            } else if (scope === "global") {
                variable.value = positionVars[1][variable.name];
            };

            updatedIntent = updatedIntent.replace(variable.placeholder, variable.value);
        });


        return updatedIntent;
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
