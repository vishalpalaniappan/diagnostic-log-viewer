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
        const header = JSON5.parse(IRStreamHeader);
        this.fileTree = header;

        this.logTypeMap = {};
        this.extractLogTypeMap();
    }

    /**
     * Extracts the logtype map for this program by processing the
     * sst of each file in the file tree. The logtype map is then
     * processed to create an object that groups logtype id's by
     * function.
     */
    extractLogTypeMap () {
        // Add a root logtype with id 0.
        const rootNode = {type: "root", id: 0, syntax: "", children: [], siblings: []};
        this.logTypeMap[0] = new LtInfo(rootNode, 0);

        // Process each SST.
        Object.keys(this.fileTree).forEach((fileName, index) => {
            this.processSST(this.fileTree[fileName].sst, 0, fileName);
        });

        /* Group all logtypes into their parent function. This information
        is used when extracting call stack, stepping over, etc.*/
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
                    this.logTypeMap[child.id] = new LtInfo(child, child.id, fileName);
                    this.processSST(child, child.id, fileName);
                    break;
                case "root":
                    this.logTypeMap[child.id] = new LtInfo(child, fid, fileName);
                    this.processSST(child, fid, fileName);
                    break;
                case "child":
                    this.logTypeMap[child.id] = new LtInfo(child, fid, fileName);
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
            sourceTree[fileName] = this.fileTree[fileName].source;
        });
        return sourceTree;
    }
}

export default CdlHeader;
