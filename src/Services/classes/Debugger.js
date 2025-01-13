import clpFfiJsModuleInit from "clp-ffi-js";

import CDL_WORKER_PROTOCOL from "../CDL_WORKER_PROTOCOL";
import {readFile} from "../helper/ReadFile";
import CDL from "./CDL";

/**
 * This class accepts a CDL file object or URL and exposes the functions
 * needed to debug the program using the log file.
 */
class Debugger {
    /**
     * Loads the CDL file and initializes the debugger state.
     * @param {File|String} cdlFile File object or URL of CDL log file.
     */
    constructor (cdlFile) {
        readFile(cdlFile).then(async (data) => {
            const module = await clpFfiJsModuleInit();
            const streamReader = new module.ClpStreamReader(data, {});
            const log = streamReader.decodeRange(0, streamReader.deserializeStream(), false);
            this.parseLogAndInitializeDebugger(log);
        });
    }

    /**
     * This function parses the CDL log file and intializes debugger state.
     * @param {Array} log Contents of decompressed CDL log file.
     */
    parseLogAndInitializeDebugger (log) {
        this.cdl = new CDL(log);
        console.log(this.cdl);
        postMessage({
            code: CDL_WORKER_PROTOCOL.GET_METADATA,
            args: {
                fileTree: this.cdl.header.getSourceFiles(),
            },
        });
    }
};

export default Debugger;
