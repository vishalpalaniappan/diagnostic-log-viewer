import JSON5 from "json5";

import LtInfo from "./LtInfo";

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
        this.header = JSON5.parse(IRStreamHeader);
        this.logTypeMap = {};
        this.variableMap = {};
        this.functionMap = {};
        this.parseHeader();
    }

    /**
     * Prase the header of the CDL file and extract the
     * logtype map, function map and variable map.
     */
    parseHeader () {
        Object.keys(this.header.ltMap).forEach((logtype, index) => {
            const ltInfo = this.header.ltMap[logtype];

            // Add to logtype map
            this.logTypeMap[logtype] = new LtInfo(
                ltInfo,
                ltInfo.funcid,
                this._getFileFromLogType(logtype)
            );

            // Add logtype to function map
            !(ltInfo.funcid in this.functionMap) && (this.functionMap[ltInfo.funcid] = []);
            this.functionMap[ltInfo.funcid].push(logtype);

            // Add variables to variable map
            ltInfo.vars.forEach((varInfo, index) => {
                this.variableMap[varInfo.varId] = {
                    name: varInfo.name,
                    logType: logtype,
                };
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
            if (minLt <= logtype && maxLt >= logtype) {
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
