import JSON5 from "json5";

import LT_INFO from "./LT_INFO";

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
        this.functions = {};
        this.extractLogTypeMap();
    }

    /**
     * Extracts the logtype map for this program by processing the
     * sst of each file in the file tree. The logtype map is then
     * processed to create an object that groups functions by logtype.
     */
    extractLogTypeMap () {
        this.logTypeMap["global"] = new LT_INFO({
            type: "global",
            id: "global",
            fid: "global",
        });

        Object.keys(this.fileTree).forEach((fileName, index) => {
            this.processSST(this.fileTree[fileName].sst, "global");
        });

        // Note that this information can be extracted in the previous
        // step. It is separated here because it improves readability.
        Object.keys(this.logTypeMap).forEach((ltIndex, index) => {
            const ltMap = this.logTypeMap[ltIndex];
            const functionLt = this.logTypeMap[ltMap.getfId()];
            functionLt.addChildId(ltMap.getId());
        });
    }

    /**
     * Recursively processes the SST until all nodes are consumed.
     * @param {Object} root
     * @param {string} fid
     */
    processSST (root, fid) {
        const nodes = root.children.concat(root.siblings);
        nodes.forEach((child, index) => {
            switch (child.type) {
                case "function":
                    child.fid = child.id;
                    this.processSST(child, child.id);
                    break;
                case "root":
                    child.fid = fid;
                    this.processSST(child, fid);
                    break;
                case "child":
                    child.fid = fid;
                    break;
                default:
                    console.debug(`Unknown child type:${child.type}`);
                    break;
            }
            this.logTypeMap[child.id] = new LT_INFO(child);
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
