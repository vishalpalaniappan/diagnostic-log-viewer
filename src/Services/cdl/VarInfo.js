
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
    constructor(varInfo, logType) {
        if (!varInfo || typeof varInfo !== 'object') {
            throw new Error('varInfo must be a non-null object');
        }
        if (logType === undefined || logType === null) {
            throw new Error('logType is required');
        }
        
        for (const key in varInfo) {
            if (Object.prototype.hasOwnProperty.call(varInfo, key)) {
                this[key] = varInfo[key];
            }
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

    /**
     * This function indicates if this is a global variable.
     * @return {Boolean}
     */
    isGlobal () {
        return "global" in this && this.global === true
    }
};

export default VarInfo;
