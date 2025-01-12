import JSON5 from "json5";

/**
 *
 */
class CDL_HEADER {
    /**
     * @param {Array} IRStreamHeader Object containing the contents
     * of CDL IRStream header.
     */
    constructor (IRStreamHeader) {
        const header = JSON5.parse(IRStreamHeader);
        this.fileTree = header;
    }

    /**
     * Returns the source of each file in the header.
     * @return {object} sourceTree
     */
    getSourceFiles () {
        const sourceTree = {};
        Object.keys(this.fileTree).forEach((fileName, index) => {
            sourceTree[fileName] = this.fileTree[fileName].source;
        });
        return sourceTree;
    }
}

export default CDL_HEADER;
