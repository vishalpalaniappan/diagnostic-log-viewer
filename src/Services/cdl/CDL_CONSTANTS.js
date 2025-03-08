const LINE_TYPE = {
    "VARIABLE": 1,
    "EXCEPTION": 2,
    "EXECUTION": 3,
    "IR_HEADER": 4,
};

const LINE_TYPE_DELIMITER = {
    "VARIABLE": "#",
    "EXCEPTION": "?",
    "IR_HEADER": "{",
    "VAR_UNIQUE_ID": "@",
};

export {LINE_TYPE, LINE_TYPE_DELIMITER};
