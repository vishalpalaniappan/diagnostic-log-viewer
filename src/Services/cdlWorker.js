
import CDL_WORKER_PROTOCOL from "./CDL_WORKER_PROTOCOL";

onmessage = function (e) {
    switch (e.data.code) {
        case CDL_WORKER_PROTOCOL.LOAD_FILE:
            try {
                console.log(e.data);
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
