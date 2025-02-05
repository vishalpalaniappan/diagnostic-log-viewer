
/**
 * This class accepts an SST node and exposes functions to extract
 * metadata from it. Each node in the SST contains the logtype id,
 * type(root, child etc.), lineno, syntax, variables, children and
 * siblings.
 */
class LtInfo {
    /**
     * @param {Array} ltInfoSST Log type information extracted from SST.
     * @param {String} filePath File this logtype belongs to.
     */
    constructor (ltInfoSST, filePath) {
        this.lt = ltInfoSST;
        this.lt.filePath = filePath;
        this.lt.fileName = filePath.split("/").pop();
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
     * Indicates if the current logtype is a function definition
     * @return {Boolean}
     */
    isFunction() {
        return this.lt.type === "function";
    }

    /**
     * This function returns the lineno of the current logtype.
     * @return {String}
     */
    getLineNo () {
        return this.lt.lineno;
    }

    /**
     * This function returns the syntax
     * @return {String}
     */
    getfName () {
        return this.lt.lineno;
    }

    /**
     * This function sets the function name
     * @param {String} funcName
     */
    setFuncName (funcName) {
        if (funcName.includes("def")) {
            this.lt.funcName = funcName.split("def ")[1].split("(")[0];
        } else {
            this.lt.funcName = funcName;
        }
    }

    /**
     * This function returns the function name
     * @return {String}
     */
    getFuncName () {
        return this.lt.funcName;
    }


    /**
     * This function returns the file path of the current logtype.
     * @return {String}
     */
    getFilePath () {
        return this.lt.filePath;
    }


    /**
     * This function returns the file name of the current logtype.
     * @return {String}
     */
    getFileName () {
        return this.lt.fileName;
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
        return this.lt.funcid;
    }

    /**
     * This function returns the variables of the current logtype.
     * @return {String}
     */
    getVariables () {
        return this.lt.vars;
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
        return this.childIds.includes(id);
    }
};

export default LtInfo;
