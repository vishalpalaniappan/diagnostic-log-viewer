
import Debugger from "./cdl/Debugger";
import CDL_WORKER_PROTOCOL from "./CDL_WORKER_PROTOCOL";

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
                debuggerInstance.getPositionData(e.data.args.position);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK:
            try {
                debuggerInstance.getVariableStack(e.data.args.position);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.STEP_INTO:
            try {
                debuggerInstance.stepInto(e.data.args.position);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.STEP_OUT:
            try {
                debuggerInstance.stepOut(e.data.args.position);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.STEP_OVER_FORWARD:
            try {
                debuggerInstance.stepOverForward(e.data.args.position);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.STEP_OVER_BACKWARD:
            try {
                debuggerInstance.stepOverBackward(e.data.args.position);
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.GO_TO_START:
            try {
                debuggerInstance.goToStart();
            } catch (e) {
                console.error(e);
            }
            break;
        case CDL_WORKER_PROTOCOL.GO_TO_END:
            try {
                debuggerInstance.goToEnd();
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
