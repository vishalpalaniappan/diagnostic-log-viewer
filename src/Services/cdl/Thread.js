import AbstractionMap from "./AbstractionMap";
import CdlHeader from "./CdlHeader";

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
        this.map = this.getExecutionTree(this.currPosition);
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
     * This function gets the execution tree given the position.
     * @param {*} finalPosition
     * @return {Object|null}
     */
    getExecutionTree (finalPosition) {
        if (!this.header.hasAbstractionMap()) {
            console.log("Trace file does not have an abstraction map");
            return null;
        }

        const sdg = this.header.getSDG();
        const sdgMeta = this.header.getSDGMeta();
        const designMap = this.header.getDesignMap();

        if (!sdg || !sdgMeta) {
            console.log("Trace file is missing required SDG data or metadata");
            return null;
        }

        const map = new AbstractionMap(sdg, sdgMeta, designMap);

        let position = 0;
        do {
            const positionData = this.execution[position];
            if (positionData.type === "adli_execution") {
                const abstractionInstance = this.header.logTypeMap[positionData.value];
                abstractionInstance.threadId = this.threadId;
                abstractionInstance.position = position;
                abstractionInstance.timestamp = positionData.timestamp;

                /**
                 *  TODO: This practice of saving the var stack info in the
                 *  abstraction info is really strange and I should not be
                 *  doing this, so I will revisit this later to change it.
                 */


                // These variable stacks are used to replace the placeholders
                // in the intent and to validate the constraints.
                abstractionInstance.currVarStack = this.getVariablesAtPosition(position);
                abstractionInstance.nextVarStack = null;

                /*
                 We go to the next position because the variable values for
                 the current position are logged after the statement.

                 For example:
                 a = b + 1
                 logVariable(a);
                 c = d + 2

                 So we need to load the value of a from the c = d + 2 statement.
                 We save the next var stack to the abstraction so that we can
                 access it when validating the constraints.

                 TODO:
                 This is not an ideal solution, if the constraint we are
                 validating is in the last statement (for example a return
                 statement), then we need to just access the variable values,
                 the next statement is not going to be in the same function.
                 */
                let nextPos = this._getNextPosition(position);
                while (nextPos !== null) {
                    const nextPositionData = this.execution[nextPos];
                    const nextAbstraction = this.header.logTypeMap[nextPositionData.value];
                    if (nextAbstraction.getfId() === abstractionInstance.getfId()) {
                        abstractionInstance.nextVarStack =
                            this.getVariablesAtPosition(nextPos);
                        break;
                    }
                    nextPos = this._getNextPosition(nextPos);
                }

                map.mapCurrentLevel(abstractionInstance);
            }
        } while (position++ < finalPosition);

        // If the program ended in failure, save the exception
        // to the final node in the semantic execution graph
        let failedAbstraction;
        if (this.exception && map.executionTree.length > 0) {
            const len = map.executionTree.length;
            const lastEntry = map.executionTree[len - 1];
            lastEntry.exception = this.exception;
            failedAbstraction = lastEntry.abstractionId;
        }


        /**
         * Through the instrumentation, we can now identify the failures
         * caused by a constraint violation. Through this, when a failure
         * happens, the violations which create this failure are identified.
         *
         * There can be multiple violations, for example, a statement could
         * concatonate the first character of two strings, so if you give it
         * two empty strings, the failure is caused by two constraint
         * violations. I choose to label both as a root cause but the failure
         * will specifically highlight the first variable that was checked.
         */

        // Verify that there were violations before trying to map it to graph.
        if (map.violations.length > 0) {
            // Find if any of the identified violations
            // cause this abstraction to fail.
            const filteredViolations = [];
            for (let i = 0; i < map.violations.length; i++) {
                const violation = map.violations[i];
                if (violation.constraint?.failures?.includes(failedAbstraction)) {
                    filteredViolations.push(violation);
                }
            }

            // Save the violations to the semantic execution graph.
            // The earliest violation is the root cause.
            // TODO: Improve this crude implementation.
            for (let i = 0; i < filteredViolations.length; i++) {
                const entry = filteredViolations[i];
                map.executionTree[entry.index].rootCause = true;
                map.executionTree[entry.index].violation = entry;
            }


            /**
             * Save root causes to last entry so we can display them.
             * This is temporary and I will replace this with a more
             * maintainable and scalable approach.
             ***/
            if (this.exception && filteredViolations.length > 0 && map.executionTree.length > 0) {
                const lastEntry = map.executionTree[map.executionTree.length - 1];
                const abstractionId = lastEntry["abstractionId"];
                const failureInfo = [];

                filteredViolations.forEach((violation, index) => {
                    const rootcauseMap = violation.constraint?.rootcause;
                    if (rootcauseMap && abstractionId in rootcauseMap) {
                        const cause = rootcauseMap[abstractionId];
                        failureInfo.push({
                            "index": violation.index,
                            "cause": cause,
                        });
                    }
                });
                lastEntry.violations = filteredViolations;
                lastEntry.failureInfo = failureInfo;
            }
        }

        this.executionTree = map.executionTree;

        this.executionTreeFull = [];
        for (let i = 0; i < map.executionTree.length; i++) {
            this.executionTreeFull.push({...map.executionTree[i]});
        }

        return map;
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
