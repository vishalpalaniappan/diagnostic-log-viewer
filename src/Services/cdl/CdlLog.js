import CDL_WORKER_PROTOCOL from "../CDL_WORKER_PROTOCOL";
import {LINE_TYPE} from "./CDL_CONSTANTS";
import CdlHeader from "./CdlHeader";
import CdlLogLine from "./CdlLogLine";

/**
 *
 */
class CdlLog {
    /**
     * @param {Array} logFile Array containing lines of the log file.
     */
    constructor (logFile) {
        this.exception = null;
        this.header = {};
        this.execution = [];
        this.executionTree = {};
        this.callStacks = {};
        this.callStack = [];

        this.globalVariables = {};

        this._processLog(logFile);
    }

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
     * Add to call stack while processing log.
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
            const currFunction = cs[cs.length - 1];
            if (this.execution[currFunction].lt ===  currLt.getfId()) {
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
     * Returns the variables in the current function given a starting position.
     * @param {Number} position 
     * @returns {Object} Returns the variables belonging to current function.
     */
    getVariablesAtPosition(position) {
        const variables = {};
        const startLog = this.execution[position];
        const currFuncId = this.header.logTypeMap[startLog.lt].getfId();

        do {
            const currLog = this.execution[position];
            
            // If the start of the function is reached, break.
            if (currLog.type === LINE_TYPE.EXECUTION && currLog.lt === currFuncId) {
                break;
            }
            
            // If var is in curr function and it is the first visit, save var.
            if (currLog.type === LINE_TYPE.VARIABLE) {
                const variable = this.header.variableMap[currLog.varid];
                const varFuncId = this.header.logTypeMap[variable.logType].getfId();

                if (varFuncId === currFuncId && !(variable.name in variables)) {
                    variables[variable.name] = currLog.value;
                }
            }
        } while (--position > 0);

        return variables;
    }

    /**
     * Returns the previous position with an execution log type.
     * @param {Number} position 
     * @returns 
     */
    _getPreviousPosition(position) { 
        while(--position >= 0) {
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
     * @returns 
     */
    _getNextPosition(position) { 
        while(++position < this.execution.length) {
            const line = this.execution[position];
            if (line.type === LINE_TYPE.EXECUTION) {
                return position;
            }
        }
        return null;
    }


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

}

export default CdlLog;
