const LINE_TYPE = {
    "VARIABLE": 1,
    "EXCEPTION": 2,
    "EXECUTION": 3,
    "IR_HEADER": 4,
    "UNIQUE_ID": 5,
};

const LINE_TYPE_DELIMITER = {
    "VARIABLE": "#",
    "EXCEPTION": "?",
    "IR_HEADER": "{",
    "UNIQUE_ID": "@",
};

export {LINE_TYPE, LINE_TYPE_DELIMITER};
