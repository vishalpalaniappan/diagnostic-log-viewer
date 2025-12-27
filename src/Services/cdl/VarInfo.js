
/**
 * This class contains all the metadata for a variable extracted by the
 * ADLI tool (lineNo, colNum, varid etc...).
 */
class VarInfo {
    /**
     * @param {Object} varInfo Variable info.
     * @param {Number} logType Logtype this variable belogns to.
     */
    constructor (varInfo) {
        for (const key in varInfo) {
            if (Object.prototype.hasOwnProperty.call(varInfo, key)) {
                this[key] = varInfo[key];
            }
        }
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
        return "global" in this && this.global === true;
    }
};

export default VarInfo;
