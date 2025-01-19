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
        const rootNode = {
            type: "root",
            id: 0,
            syntax: "",
            children: [],
            siblings: [],
        };

        // Add a root logtype with id 0.
        this.logTypeMap[0] = new LT_INFO(rootNode, 0);

        Object.keys(this.fileTree).forEach((fileName, index) => {
            this.processSST(this.fileTree[fileName].sst, 0, fileName);
        });

        // Note that this information can be extracted in the previous
        // step. It is separated here because it improves readability.
        Object.keys(this.logTypeMap).forEach((ltIndex, index) => {
            const lt = this.logTypeMap[ltIndex];
            this.logTypeMap[lt.getfId()].addChildId(lt.getId());
        });
    }

    /**
     * Recursively processes the SST until all nodes are consumed.
     * @param {Object} root
     * @param {String} fid
     * @param {String} fileName
     */
    processSST (root, fid, fileName) {
        const nodes = root.children.concat(root.siblings);
        nodes.forEach((child, index) => {
            switch (child.type) {
                case "function":
                    this.logTypeMap[child.id] = new LT_INFO(child, child.id, fileName);
                    this.processSST(child, child.id, fileName);
                    break;
                case "root":
                    this.logTypeMap[child.id] = new LT_INFO(child, fid, fileName);
                    this.processSST(child, fid, fileName);
                    break;
                case "child":
                    this.logTypeMap[child.id] = new LT_INFO(child, fid, fileName);
                    break;
                default:
                    console.debug(`Unknown SST Node Type:${child.type}`);
                    break;
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
            sourceTree[fileName] = this.fileTree[fileName];
        });
        return sourceTree;
    }
}

export default CDL_HEADER;
