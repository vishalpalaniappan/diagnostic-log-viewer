const LINE_TYPE = {
    "VARIABLE": 1,
    "EXCEPTION": 2,
    "EXECUTION": 3,
    "IR_HEADER": 4,
};

const LINE_TYPE_IND = {
    "VARIABLE": "#",
    "EXCEPTION": "?",
    "IR_HEADER": "{",
};

/**
 *
 */
class CDL_LOG {
    /**
     *
     * @param {String} log
     */
    constructor (log) {
        this.log = log;
        this._classify();
    }

    /**
     *
     * @param {String} log
     */
    processVariable (log) {
        this.type = LINE_TYPE.VARIABLE;
        const [lt, ...variable] = log.slice(2).split(" ");
        this.value = variable.join(" ");
        this.lt = parseInt(lt);
    }

    /**
     *
     * @param {String} log
     */
    processExeception (log) {
        this.type = LINE_TYPE.EXCEPTION;
        const [lt, ...exception] = log.slice(2).split(" ");
        this.value = exception.join(" ");
        this.lt = parseInt(lt);
    }

    /**
     *
     * @param {String} log
     */
    processIRHeader (log) {
        this.type = LINE_TYPE.IR_HEADER;
        this.value = log;
    }
    /**
     *
     */
    _classify () {
        const fullStr = this.log[0].split("root ");
        const log = fullStr.slice(1).join(" ").trim();

        switch (log.charAt(0)) {
            case LINE_TYPE_IND.VARIABLE:
                this.processVariable(log);
                break;
            case LINE_TYPE_IND.EXCEPTION:
                this.processExeception(log);
                break;
            case LINE_TYPE_IND.IR_HEADER:
                this.processIRHeader(log);
                break;
            default:
                this.type = LINE_TYPE.EXECUTION;
                this.lt = parseInt(log);
                break;
        }
    }
};

export {
    CDL_LOG as default,
    LINE_TYPE
};
