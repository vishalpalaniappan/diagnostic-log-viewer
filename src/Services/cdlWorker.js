
import Debugger from "./cdl/Debugger";
import CDL_WORKER_PROTOCOL from "./CDL_WORKER_PROTOCOL";

let debuggerInstance;
onmessage = function (e) {
    try {
        const args = (e?.data?.args)?e.data.args:{};
        switch (e.data.code) {
            case CDL_WORKER_PROTOCOL.LOAD_FILE:
                debuggerInstance = new Debugger(args.fileInfo);
                break;

            case CDL_WORKER_PROTOCOL.GET_VARIABLE_STACK:
                debuggerInstance.getVariableStack(args.position);
                break;

            case CDL_WORKER_PROTOCOL.STEP_INTO:
                debuggerInstance.stepInto(args.position);
                break;

            case CDL_WORKER_PROTOCOL.STEP_OUT:
                debuggerInstance.stepOut(args.position);
                break;
                
            case CDL_WORKER_PROTOCOL.STEP_OVER_FORWARD:
                debuggerInstance.stepOverForward(args.position);
                break;

            case CDL_WORKER_PROTOCOL.STEP_OVER_BACKWARD:
                debuggerInstance.stepOverBackward(args.position);
                break;

            case CDL_WORKER_PROTOCOL.GO_TO_START:
                debuggerInstance.goToStart();
                break;

            case CDL_WORKER_PROTOCOL.GO_TO_END:
                debuggerInstance.goToEnd();
                break;

            case CDL_WORKER_PROTOCOL.PLAY_BACKWARD:
                debuggerInstance.playBackward(args.position);
                break;

            case CDL_WORKER_PROTOCOL.PLAY_FORWARD:
                debuggerInstance.playForward(args.position);
                break;

            case CDL_WORKER_PROTOCOL.REPLAY:
                debuggerInstance.replayProgram();
                break;

            case CDL_WORKER_PROTOCOL.TOGGLE_BREAKPOINT:
                debuggerInstance.toggleBreakpoint(args.fileName, args.lineNumber);
                break;

            default:
                break;
        }
    } catch (e) {
        console.error(e);
    }
};

onerror = (e) => {
    console.debug(e);
};
