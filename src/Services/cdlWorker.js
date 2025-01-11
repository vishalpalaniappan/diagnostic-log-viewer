
import CDL_WORKER_PROTOCOL from "./CDL_WORKER_PROTOCOL";
import Debugger from "./classes/Debugger";

let debuggerInstance;
onmessage = function (e) {
    switch (e.data.code) {
        case CDL_WORKER_PROTOCOL.LOAD_FILE:
            try {
                debuggerInstance = new Debugger(e.data.fileInfo);
            } catch (e) {
                console.log(e);
            }
            break;
        default:
            break;
    }
};

onerror = (e) => {
    console.debug(e);
};
