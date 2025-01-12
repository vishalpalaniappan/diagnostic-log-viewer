
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
    }
};

export default LT_INFO;
