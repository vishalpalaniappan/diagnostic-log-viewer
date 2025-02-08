import {LINE_TYPE, LINE_TYPE_DELIMITER} from "./CDL_CONSTANTS";
/**
 * This class accepts a line from a CDL log, classifys it and exposes
 * the extracted metadata.
 */
class CdlLogLine {
    /**
     * @param {Array} logLine The contents of a single log line.
     */
    constructor (logLine) {
        const fullStr = logLine[0].split("root ");
        const log = fullStr.slice(1).join(" ").trim();

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
        const [varid, ...variable] = log.slice(2).split(" ");
        this.value = this._parseVariableIfJSON(variable.join(" "));
        this.varid = parseInt(varid);
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
     * Extract metadata from header log line.
     * @param {String} log
     */
    _processIRHeader (log) {
        this.type = LINE_TYPE.IR_HEADER;
        this.value = log;
    }

    /**
     * Parses the variable value if it is a JSON string.
     */
    _parseVariableIfJSON (variable) {
        try{
            return JSON.parse(variable);
        } catch (exception) {
            return variable;
        }
    }
};

export default CdlLogLine;
