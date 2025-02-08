import JSON5 from "json5";

import LtInfo from "./LtInfo";
import VarInfo from "./VarInfo.js"

/**
 * This class processes the header of the CDL file and exposes the
 * extracted metadata.
 */
class CdlHeader {
    /**
     * @param {Array} IRStreamHeader Object containing the contents
     * of CDL IRStream header.
     */
    constructor (IRStreamHeader) {
        if (!IRStreamHeader) {
            throw new Error('IRStreamHeader is required.');
        }
        try {
            this.header = JSON5.parse(IRStreamHeader);
            if (!this.header || typeof this.header !== 'object') {
                throw new Error('Invalid header format.');
            }
            this.logTypeMap = {};
            this.variableMap = {};
            this.parseHeader();
        } catch (error) {
            throw new Error(`Failed to parse header: ${error.message}.`);
        }
    }

    /**
     * Prase the header of the CDL file and extract the
     * logtype map, function map and variable map.
     */
    parseHeader () {
        if (!this.header?.ltMap) {
            throw new Error("Invalid header: ltMap is missing.");
        }

        Object.keys(this.header.ltMap).forEach((logtype, index) => {
            // Get file name for current logtype
            const fileName = this._getFileFromLogType(logtype);
            if (!fileName) {
                throw new Error(`Could not determine file for logtype: ${logtype}.`);
            }

            // Get logtype info for current logtype
            const ltInfo = this.header.ltMap[logtype];
            if (ltInfo?.funcid === undefined || !Array.isArray(ltInfo.vars)) {
                throw new Error(`Invalid ltInfo structure for logtype: ${logtype}.`);
            }

            // Add to logtype map
            this.logTypeMap[logtype] = new LtInfo(ltInfo, fileName);

            // Add to variable map
            ltInfo.vars.forEach((varInfo, index) => {
                if (!varInfo?.varId || !varInfo?.name) {
                    throw new Error(`Invalid variable info in logtype: ${logtype}.`);
                }

                this.variableMap[varInfo.varId] = new VarInfo(varInfo, logtype);
            });
        });
    }

    /**
     * Returns the file which this logtype belongs to.
     *
     * @param {Number} logtype
     * @return {String}
     */
    _getFileFromLogType (logtype) {
        for (const fileName in this.header.fileTree) {
            const minLt = this.header.fileTree[fileName].minLt;
            const maxLt = this.header.fileTree[fileName].maxLt;
            if (minLt < logtype && maxLt >= logtype) {
                return fileName;
            }
        }
        return null;
    }

    /**
     * Returns the source of each file in the header.
     *
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
}

export default CdlHeader;
