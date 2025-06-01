
/**
 * This class contains all the metadata for each node extracted by the
 * ADLI tool (lineno, variables, logtypeid etc..).It also saves the
 * filename and file path.
 */
class LtInfo {
    /**
     * @param {Array} ltInfo Log type information extracted from SST.
     * @param {String} filePath File this logtype belongs to.
     */
    constructor (ltInfo, filePath) {
        for (const key in ltInfo) {
            if (key) {
                this[key] = ltInfo[key];
            }
        }
        this.filePath = filePath;
        this.fileName = filePath.split("/").pop();
    }

    /**
     * Indicates if the current logtype is a function definition
     * @return {Boolean}
     */
    isFunction () {
        return this.type === "function";
    }

    /**
     * Returns the line number of logtype.
     * @return {String}
     */
    getLineNo () {
        return this.lineno;
    }

    /**
     * Returns the function name.
     * @return {String}
     */
    getFuncName () {
        return this.name;
    }


    /**
     * Returns the file path this logtype belongs to.
     * @return {String}
     */
    getFilePath () {
        return this.filePath;
    }


    /**
     * This function returns the file name.
     * @return {String}
     */
    getFileName () {
        return this.fileName;
    }

    /**
     * Returns the logtype id.
     * @return {String}
     */
    getId () {
        return this.id;
    }

    /**
     * Returns the function logtype this logtype belongs to.
     * @return {String}
     */
    getfId () {
        return this.funcid;
    }

    /**
     * Returns an array of variables belonging to this logtype.
     * @return {Array|Object}
     */
    getVariables () {
        return this.vars;
    }

    /**
     * Returns this type of log type (function, child etc).
     * @return {String}
     */
    getType () {
        return this.type;
    }

    /**
     * Returns the syntax for this log type (this will be deprecated soon).
     * @return {String}
     */
    getSyntax () {
        return this.syntax;
    }
};

export default LtInfo;
