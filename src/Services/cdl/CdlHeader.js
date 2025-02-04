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
        this.fileTree = this.header.fileTree;
        this.logTypeMap = {};
        this.variableMap = {};

        this.functionMap = {};
        this.parseHeader();
    }

    /**
     * Prase the header of the CDL file and extract the following:
     * - LogTypeMap
     * - FunctionMap
     * - VariableMap
     */
    parseHeader () {
        Object.keys(this.header.ltMap).forEach((logtype, index) => {
            const fileName = this._getFileFromLogType(logtype);
            const ltInfo = this.header.ltMap[logtype];
            this.logTypeMap[logtype] = new LtInfo(ltInfo, ltInfo.funcid, fileName);

            if (ltInfo.funcid in this.functionMap) {
                this.functionMap[ltInfo.funcid].push(logtype);
            } else {
                this.functionMap[ltInfo.funcid] = [logtype];
            }

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
            if (fileName) {
                const minLt = this.fileTree[fileName].minLt;
                const maxLt = this.fileTree[fileName].maxLt;
                if (minLt <= logtype && maxLt >= logtype) {
                    return fileName;
                }
            }
        }
    }

    /**
     * Returns the source of each file in the header.
     * @return {object} sourceTree
     */
    getSourceFiles () {
        const sourceTree = {};
        Object.keys(this.header.fileTree).forEach((fileName, index) => {
            sourceTree[fileName] = this.header.fileTree[fileName].source;
        });
        return sourceTree;
    }
}

export default CdlHeader;
