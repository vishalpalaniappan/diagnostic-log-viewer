
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
        case CDL_WORKER_PROTOCOL.GO_TO_POSITION:
            try {
                debuggerInstance._goToPosition(e.data.args.position);
            } catch (e) {
                console.log(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK:
            try {
                console.log(e.data.args);
                debuggerInstance.getVariableStack(e.data.args.position);
            } catch (e) {
                console.log(e);
            }
        default:
            break;
    }
};

onerror = (e) => {
    console.debug(e);
};
