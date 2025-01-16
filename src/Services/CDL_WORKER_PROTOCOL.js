let CDL_WORKER_PROTOCOL = {
    LOAD_FILE: 1,
    GET_METADATA: 2,
    GET_POSITION_DATA: 3,
    GET_VARIABLE_STACK: 4,
    GO_TO_POSITION: 5,
    GET_STACK_POSITION_DATA: 6,
    STEP_INTO: 7,
    STEP_OUT: 8,
    STEP_OVER_FORWARD: 9,
    STEP_OVER_BACKWARD: 10,
};
CDL_WORKER_PROTOCOL = Object.freeze(CDL_WORKER_PROTOCOL);

export default CDL_WORKER_PROTOCOL;
