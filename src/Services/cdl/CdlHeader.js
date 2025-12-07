import LtInfo from "./LtInfo";
import VarInfo from "./VarInfo.js";

/**
 * This class processes the header of the CDL file and exposes the
 * logtype and variable maps.
 */
class CdlHeader {
    /**
     * @param {Array} IRStreamHeader Object containing the contents
     * of CDL IRStream header.
     */
    constructor (IRStreamHeader) {
        if (!IRStreamHeader) {
            throw new Error("IRStreamHeader is required.");
        }
        this.header = IRStreamHeader;
        if (!this.header || typeof this.header !== "object") {
            throw new Error("Invalid header format.");
        }
        this.logTypeMap = {};
        this.variableMap = {};
        this.parseHeader();
    }

    /**
     * Prase the header of the CDL file and extract the
     * logtype map, function map and variable map.
     */
    parseHeader () {
        if (!this.header?.ltMap) {
            throw new Error("Invalid header: ltMap is missing.");
        }

        for (const logTypeId in this.header.ltMap) {
            if (logTypeId) {
                const ltInfo = this.header.ltMap[logTypeId];
                const fileName = this._getFileFromLogType(logTypeId);
                this.logTypeMap[logTypeId] = new LtInfo(ltInfo, fileName);
            }
        }

        for (const varId in this.header.varMap) {
            if (varId) {
                const variable = this.header.varMap[varId];
                this.variableMap[varId] = new VarInfo(variable);
            }
        }
    }

    /**
     * Get the logtype from the runtime injected file.
     * @param {String} filename
     * @param {Number} lineNumber
     * @return {Object|null}
     */
    getLtFromInjectedLineno (filename, lineNumber) {
        for (const key in this.logTypeMap) {
            if (key) {
                const ltInfo = this.logTypeMap[key];
                if (filename == ltInfo.file && lineNumber == ltInfo.injectedLineno) {
                    return ltInfo;
                }
            }
        }
        return null;
    }

    /**
     * Returns the logtype given the filename and line number if it exists.
     * @param {String} fileName
     * @param {Number} lineNumber
     * @return {Object|null}
     */
    getLogTypeFromLineNumber (fileName, lineNumber) {
        const minLt = this.header.fileTree[fileName].minLt;
        const maxLt = this.header.fileTree[fileName].maxLt;

        for (let i = minLt + 1; i <= maxLt; i++) {
            const startLineNo = this.logTypeMap[i].lineno;
            if (lineNumber == startLineNo) {
                return this.logTypeMap[i];
            }
        }

        return null;
    }

    /**
     * Returns the file which this logtype belongs to.
     * Minimum LT is not included in the comparison window.
     * @param {Number} logtype
     * @return {String}
     */
    _getFileFromLogType (logtype) {
        for (const fileName in this.header.fileTree) {
            if (fileName) {
                const minLt = this.header.fileTree[fileName].minLt;
                const maxLt = this.header.fileTree[fileName].maxLt;
                if (minLt < logtype && maxLt >= logtype) {
                    return fileName;
                }
            }
        }
        return null;
    }

    /**
     * Returns the source of each file in the header.
     * @return {object} sourceTree
     */
    getSourceFiles () {
        const sourceTree = {};
        Object.keys(this.header.fileTree).forEach((fileName, index) => {
            const file = this.header.fileTree[fileName];
            if (!file.source) {
                throw new Error(`Source missing for file: ${fileName}`);
            }
            sourceTree[fileName] = file.source;
        });
        return sourceTree;
    }

    /**
     * @return {Boolean} Indicates if the header has an abstraction map.
     */
    hasAbstractionMap () {
        return "sdg" in this.header;
    }

    /**
     * @return {Object} Indicates if the header has an abstraction map.
     */
    getAbstractionMap () {
        if (this.hasAbstractionMap()) {
            return this.header["sdg"];
        } else {
            return null;
        }
    }

    /**
     * @return {Object} Indicates if the header has an abstraction map.
     */
    getSDG () {
        if ("sdg" in this.header) {
            return this.header["sdg"];
        } else {
            return null;
        }
    }

    /**
     * @return {Object} Indicates if the header has an abstraction map.
     */
    getSDGMeta () {
        if ("sdg_meta" in this.header) {
            return this.header["sdg_meta"];
        } else {
            return null;
        }
    }
}

export default CdlHeader;
