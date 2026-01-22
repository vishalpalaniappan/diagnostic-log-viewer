export const STEP = Object.freeze({
    ERROR: 1,
    FORK: 2,
    GOTO_MODULE: 3,
    GOT_MODULE_AND_STEP_IN_STACK: 4,
    JOIN: 5,
    SAME_STEP: 6,
    SOLVED: 7,
    STEP_DONE: 8,
});

export const DESIGN = Object.freeze({
    CONTINUE: 1,
    ERROR: 2,
    FORK: 3,
    GOTO_MODULE: 4,
    GOT_MODULE_AND_STEP_IN_STACK: 5,
    JOIN: 6,
    STEP_DONE: 7,
});
