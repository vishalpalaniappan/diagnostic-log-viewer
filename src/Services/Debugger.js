import clpFfiJsModuleInit from "clp-ffi-js";

import {readFileFromUrl} from "./ReadFile";

/**
 * This class accepts a CDL file object or URL and exposes the functions
 * needed to debug the program using the log file.
 */
class Debugger {
    /**
     * Initializes the debugger state.
     * @param {File|String} cdlFile File object or URL of CDL log file.
     */
    constructor (cdlFile) {
        this.decompressFile(cdlFile);
    }

    /**
     * Loads and decompresses the provided CDL file.
     * @param {File|String} cdlFile
     */
    decompressFile = (cdlFile) => {
        if (cdlFile instanceof File) {
            readFileFromObject(cdlFile).then(async (data) => {
                const module = await clpFfiJsModuleInit();
                const streamReader = new module.ClpStreamReader(data, {});
                const log = streamReader.decodeRange(0, streamReader.deserializeStream(), false);
                console.log(log);
            });
        } else {
            readFileFromUrl(cdlFile).then(async (data) => {
                const module = await clpFfiJsModuleInit();
                const streamReader = new module.ClpStreamReader(data, {});
                const log = streamReader.decodeRange(0, streamReader.deserializeStream(), false);
                console.log(log);
            });
        }
    };
};

export default Debugger;
