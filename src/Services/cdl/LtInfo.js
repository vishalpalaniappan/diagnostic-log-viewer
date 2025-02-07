
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
        for (var key in ltInfo) {
            this[key] = ltInfo[key];
        }
        this.filePath = filePath;
        this.fileName = filePath.split("/").pop();
    }

    /**
     * Indicates if the current logtype is a function definition
     * @return {Boolean}
     */
    isFunction() {
        return this.type === "function";
    }

    /**
     * This function returns the lineno of the current logtype.
     * @return {String}
     */
    getLineNo () {
        return this.lineno;
    }

    /**
     * This function returns the function name
     * @return {String}
     */
    getFuncName () {
        return this.name;
    }


    /**
     * This function returns the file path of the current logtype.
     * @return {String}
     */
    getFilePath () {
        return this.filePath;
    }


    /**
     * This function returns the file name of the current logtype.
     * @return {String}
     */
    getFileName () {
        return this.fileName;
    }

    /**
     * This function returns the id of the current logtype.
     * @return {String}
     */
    getId () {
        return this.id;
    }

    /**
     * This function returns the function id of the current logtype.
     * @return {String}
     */
    getfId () {
        return this.funcid;
    }

    /**
     * This function returns the variables of the current logtype.
     * @return {Array|Object}
     */
    getVariables () {
        return this.vars;
    }

    /**
     * This function returns the type of this logtype.
     * @return {String}
     */
    getType () {
        return this.type;
    }

    /**
     * This function returns the syntax of this logtype.
     * @return {String}
     */
    getSyntax () {
        return this.syntax;
    }
};

export default LtInfo;
