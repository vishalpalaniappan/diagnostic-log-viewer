import { func } from "prop-types";
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
            // Process call stack entry and create key to store abstractions
            const csEntry = callstack[i];
            csEntry.abstractions = [];

            // Get the position data
            const positionData = this.execution[csEntry.position];
            let ltInfo = this.header.logTypeMap[positionData.value];
            const funcId = ltInfo.getfId();
            let position = csEntry.position;

            // Find the function abstraction
            const abs = this.header.header.abstraction_info_map["abstractions"];
            const functions = this.header.header.abstraction_info_map["functions"];
            const funcAbstraction = functions[csEntry.functionName];
            csEntry.intent = funcAbstraction.intent;

            // Save abstractions called within this function
            do {
                const posData = this.execution[position];
                if (posData.type === "adli_execution") {
                    ltInfo = this.header.logTypeMap[posData.value];

                    if (funcId == ltInfo.getfId()) {
                        const abstractionMeta = abs[ltInfo.id];
                        const intent = this.replacePlaceholdersInIntent(
                            abstractionMeta, abstractionMeta.intent_short, position
                        );
                        csEntry.abstractions.push({
                            "position": position,
                            "intent": intent,
                            "abstraction": ltInfo.id,
                        });
                    }
                };
            } while (--position > 0 && ltInfo.id != funcId);


            // Check if there are any worlds defined in the function abstraction
            if (!("worlds" in funcAbstraction)) {
                continue;
            }


            /* In cases where a while loop or similar constructs are used,
             group abstractions into their respective worlds to improve
             the readability of the design flow. */

            /* In this case, we can group as follows:

             1. Since we are working backwards. Start when you find an
             abstraction that belongs to a world and keep adding
             abstractions until you find the start. This is great for
             loops what you want to separate into iterations. In the
             example below, every iteration of the while loop will
             be its own transaction.

                "library_manager": {
                    "source": [22],
                    "abstractions": [13, 14, 15, 16, 17, 18, 19, 20],
                    "intent": "Main function to manage library operations.",
                    "worlds": {
                        "1": {
                            "start": 15,
                            "end": [19,20],
                            "intent": "Transaction to receive a book and
                            place it on shelf.",
                            "abstractions": [15,16,17,18,19,20]
                        }
                    }
                }
            */

            /* 2. Start when you find an abstraction that belongs to a world
             and keep adding abstractions until you find an abstraction
             that does not belong to the world. This is great for loops
             where you want to group all iterations into one world. In the
             example below, all iterations of the while loop will be under
             a single transaction (because there is no start and end defined).

                "library_manager": {
                    "source": [22],
                    "abstractions": [13, 14, 15, 16, 17, 18, 19, 20],
                    "intent": "Main function to manage library operations.",
                    "worlds": {
                        "1": {
                            "intent": "Transaction to receive a book and
                            place it on shelf.",
                            "abstractions": [15,16,17,18,19,20]
                        }
                    }
                }

                NOTE: 2 has not been tested yet. I need to do this in levels, I'll
                come back to it soon.
            */

            position = 0;
            let absInfo;
            const worlds = funcAbstraction.worlds;
            const abstractedLevels = [];

            // Check each of the worlds defined in the function
            for (const key in worlds) {
                if (!key) continue;
                position = 0;
                do {
                    absInfo = csEntry.abstractions[position];
                    if (worlds[key].abstractions.includes(absInfo.abstraction)) {
                        // Check if abstraction belongs to a world
                        // and group them
                        const section = [];
                        do {
                            absInfo = csEntry.abstractions[position];
                            section.push(absInfo);
                            if ("start" in worlds[key]) {
                                if (absInfo.abstraction == worlds[key].start) {
                                    break;
                                }
                            } else {
                                if (!worlds[key].abstractions.includes(absInfo.abstraction)) {
                                    // TODO: Haven't implemented this yet.
                                    break;
                                }
                            }
                        } while (++position < csEntry.abstractions.length);
                        abstractedLevels.push({
                            "position": csEntry.abstractions[position].position,
                            "intent": worlds[key].intent,
                            "abstraction": section,
                        });
                    } else {
                        // Include the abstraction as is since it
                        // doesn't belong to a world
                        abstractedLevels.push(absInfo);
                    }
                } while (++position < csEntry.abstractions.length);
            }

            csEntry.abstractions = abstractedLevels;
        }
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
            return intent;
        }

        const positionVars = this.getVariablesAtPosition(position);

        let updatedIntent = intent;

        variables.forEach((variable) => {
            const scope = variable.scope;

            if (scope === "local") {
                variable.value = positionVars[0][variable.name];
            } else if (scope === "global") {
                variable.value = positionVars[1][variable.name];
            };

            if ("key" in variable) {
                variable.value = variable.value[variable.key];
            }

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
