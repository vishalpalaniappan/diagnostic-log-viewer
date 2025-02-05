import {LINE_TYPE, LINE_TYPE_DELIMITER} from "./CDL_CONSTANTS";
/**
 * This class accepts a line from a CDL log, classifys it and exposes
 * the extracted metadata.
 */
class CdlLogLine {
    /**
     * @param {Array} logFile Array containing the contents of CDL log file.
     */
    constructor (logFile) {
        this.log = logFile;
        this._classifyLogLine();
    }

    /**
     * Given a log line, this function classifys and extracts its metadata.
     * Note that the log line is in a format returned by the clp-ffi-js library.
     * In this case, it is an array with the first element containing the
     * log line. In the future, this can be optimized further.
     */
    _classifyLogLine () {
        const fullStr = this.log[0].split("root ");
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
        this.value = variable.join(" ");
        this.varid = parseInt(varid);
    }

    /**
     * Extract metadata from exception log line.
     * Exception: "? <exception>"
     * @param {String} log
     */
    _processExeception (log) {
        this.type = LINE_TYPE.EXCEPTION;
        const [lt, ...exception] = log.slice(1).split(" ");
        this.value = exception.join(" ");
        this.lt = parseInt(lt);
    }

    /**
     * Extract metadata from header log line.
     * @param {String} log
     */
    _processIRHeader (log) {
        this.type = LINE_TYPE.IR_HEADER;
        this.value = log;
    }
};

export default CdlLogLine;
