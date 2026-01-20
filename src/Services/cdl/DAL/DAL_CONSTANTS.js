export const STEP = Object.freeze({
    SAME_STEP: 1,
    STEP_DONE: 2,
    GOTO_MODULE_FROM_REPEATED_SELECTOR: 3,
    FORK: 4,
    JOIN: 5,
    ERROR: 6,
    GOTO_MODULE_AND_STEP: 7,
    SOLVED: 8,
});

export const DESIGN = Object.freeze({
    GOTO_MODULE: 1,
    FORK: 2,
    JOIN: 3,
    CONTINUE: 4,
    ERROR: 5,
    STEP_DONE: 6,
});
