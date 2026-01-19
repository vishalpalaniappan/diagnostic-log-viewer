export const STEP = Object.freeze({
    SAME_STEP: 1,
    BEHAVIOR_NOT_FOUND_IN_STEP: 2,
    STEP_DONE: 3,
    GOTO_MODULE: 4,
    FORK: 5,
    JOIN: 6,
});

export const DESIGN = Object.freeze({
    GOTO_MODULE: 1,
    BEHAVIOR_NOT_FOUND: 2,
    DESIGN_ABS_DONE: 3,
    FORK: 4,
    JOIN: 5,
    CONTINUE: 6,
});
