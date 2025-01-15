
import CDL_WORKER_PROTOCOL from "./CDL_WORKER_PROTOCOL";
import Debugger from "./classes/Debugger";

let debuggerInstance;
onmessage = function (e) {
    switch (e.data.code) {
        case CDL_WORKER_PROTOCOL.LOAD_FILE:
            try {
                debuggerInstance = new Debugger(e.data.fileInfo);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.GO_TO_POSITION:
            try {
                debuggerInstance._goToPosition(e.data.args.position);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK:
            try {
                console.log(e.data.args);
                debuggerInstance.getVariableStack(e.data.args.position);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.STEP_INTO:
            try {
                console.log("Step into:", e.data.args);
                debuggerInstance.stepInto();
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.STEP_OUT:
            try {
                console.log("Step out:", e.data.args);
                debuggerInstance.stepOut();
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.STEP_OVER_FORWARD:
            try {
                console.log("Step over forward:", e.data.args);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.STEP_OVER_BACKWARD:
            try {
                console.log("Step over backward:", e.data.args);
            } catch (e) {
                console.error(e);
            }
            break;
        default:
            break;
    }
};

onerror = (e) => {
    console.debug(e);
};
