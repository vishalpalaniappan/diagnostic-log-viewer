export const STEP = Object.freeze({
    SAME_BEHAVIOR: 1,
    BEHAVIOR_NOT_FOUND: 2,
    STEP_SUCCESS: 3,
    STEP_INVALID: 4,
    GOTO_MODULE: 5,
});

export const STACK = Object.freeze({
    GOTO_MODULE: 1,
    BEHAVIOR_NOT_FOUND: 2,
});