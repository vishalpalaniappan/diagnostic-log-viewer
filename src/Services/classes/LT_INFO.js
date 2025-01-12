
/**
 * This class accepts an SST node and exposes functions to extract
 * metadata from it.
 */
class LT_INFO {
    /**
     * @param {Array} ltInfoSST Log type information extracted from SST.
     */
    constructor (ltInfoSST) {
        this.lt = ltInfoSST;
        this.childIds = [];
    }

    /**
     * This function adds child elements which belong to this function.
     * This includes id's that are contained in child nodes.
     * @param {Number} id
     */
    addChildId (id) {
        this.childIds.push(id);
    }

    /**
     * This function returns the id of the current logtype.
     * @return {String}
     */
    getId () {
        return this.lt.id;
    }

    /**
     * This function returns the function id of the current logtype.
     * @return {String}
     */
    getfId () {
        return this.lt.fid;
    }

    /**
     * This function returns the type of this logtype.
     * @return {String}
     */
    getType () {
        return this.lt.type;
    }

    /**
     * This function returns the syntax of this logtype.
     * @return {String}
     */
    getSyntax () {
        return this.lt.syntax;
    }

    /**
     * This function indicates if this log type contains a child
     * with the provided id.
     * @param {Number} id
     * @return {Boolean}
     */
    containsChild (id) {
        const nodes = this.lt.children.concat(this.lt.siblings);
        let hasChild = false;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.id === id) {
                hasChild = true;
                break;
            }
        }
        return hasChild;
    }
};

export default LT_INFO;
