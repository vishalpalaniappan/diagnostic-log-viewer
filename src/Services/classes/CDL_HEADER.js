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

        this.logTypeMap = {};
        this.extractLogTypeMap();
    }

    /**
     * Extracts the logtype map for this program by processing the
     * sst of each file in the file tree.
     */
    extractLogTypeMap () {
        Object.keys(this.fileTree).forEach((fileName, index) => {
            this.processSST(this.fileTree[fileName].sst);
        });
    }


    /**
     * This function recursively processes the SST.
     * @param {Object} root
     */
    processSST (root) {
        const nodes = root.children.concat(root.siblings);
        nodes.forEach((child, index) => {
            this.logTypeMap[child.id] = child;

            if (child.type === "function" || child.type === "root") {
                this.processSST(child);
            }
        });
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
