import JSON5 from "json5";

import {LINE_TYPE, LINE_TYPE_DELIMITER} from "./CDL_CONSTANTS";
/**
 * This class accepts a line from a CDL log, classifys it and exposes
 * the extracted metadata.
 */
class CdlLogLine {
    /**
     * Identify the log line type and process the line.
     * @param {Array} logLine The contents of a single log line.
     */
    constructor (logLine) {
        const pattern = /^[.:a-zA-Z0-9_.-]+ (INFO|ERROR)+ adli (.*$)/sgm;
        const log = pattern.exec(logLine[0])[2];

        switch (log.charAt(0)) {
            case LINE_TYPE_DELIMITER.VARIABLE:
                this._processVariable(log);
                break;
            case LINE_TYPE_DELIMITER.EXCEPTION:
                this._processExeception(log);
                break;
            case LINE_TYPE_DELIMITER.IR_HEADER:
                this._processIRHeader(log);
                break;
            case LINE_TYPE_DELIMITER.UNIQUE_ID:
                this._processUniqueId(log);
                break;
            default:
                this.type = LINE_TYPE.EXECUTION;
                this.lt = parseInt(log);
                break;
        }
    }

    /**
     * Extract metadata from variable log line.
     * Variable: "# <var_id> <variable_value>"
     * @param {String} log
     */
    _processVariable (log) {
        this.type = LINE_TYPE.VARIABLE;
        const pattern = /^# ([0-9]+) (.*$)/gm;
        const parsedInfo = pattern.exec(log);
        this.value = this._parseVariableIfJSON(parsedInfo[2]);
        this.varid = parseInt(parsedInfo[1]);
    }

    /**
     * Extract metadata from exception log line.
     * Exception: "? <exception>"
     * @param {String} log
     */
    _processExeception (log) {
        this.type = LINE_TYPE.EXCEPTION;
        this.value = log.slice(2);
    }

    /**
     * Extract metadata from uniqueid log line.
     * Unique Id:
     * "@ start <variable_name>"
     * "@ end <variable_name>"
     * @param {String} log
     */
    _processUniqueId (log) {
        this.type = LINE_TYPE.UNIQUE_ID;
        const info = log.split(" ");
        this.traceEvent = info[1];
        this.uid = this._parseVariableIfJSON(info[2].trim());
    }

    /**
     * Extract metadata from header log line.
     * @param {String} log
     */
    _processIRHeader (log) {
        this.type = LINE_TYPE.IR_HEADER;
        this.value = log;
    }

    /**
     * Parses the variable value if it is a JSON string.
     * @param {Object} variable
     * @return {Object}
     */
    _parseVariableIfJSON (variable) {
        try {
            return JSON5.parse(variable);
        } catch (exception) {
            return variable;
        }
    }
};

export default CdlLogLine;
