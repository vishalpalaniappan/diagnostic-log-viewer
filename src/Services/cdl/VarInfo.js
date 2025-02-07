
/**
 * This class contains all the metadata for a variable extracted by the 
 * ADLI tool (lineNo, colNum, varid etc...).It also saves the filename and
 * file path. 
 */
class VarInfo {
    /**
     * @param {Object} varInfo Variable info.
     * @param {Number} logType Logtype this variable belogns to.
     */
    constructor (varInfo, logType) {
        for (var key in varInfo) {
            this[key] = varInfo[key];
        }
        this.logType = Number(logType);
    }

    /**
     * This function returns the varId of this variable.
     * @return {String}
     */
    getVarId () {
        return this.varId;
    }
};

export default VarInfo;
