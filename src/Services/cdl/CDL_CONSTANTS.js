const LINE_TYPE = {
    "VARIABLE": 1,
    "EXCEPTION": 2,
    "EXECUTION": 3,
    "IR_HEADER": 4,
    "UID": 5,
};

const LINE_TYPE_DELIMITER = {
    "VARIABLE": "#",
    "EXCEPTION": "?",
    "IR_HEADER": "{",
    "SELF_UID": "@",
};

export {LINE_TYPE, LINE_TYPE_DELIMITER};
