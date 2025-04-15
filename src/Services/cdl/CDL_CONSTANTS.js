const LINE_TYPE = {
    "VARIABLE": 1,
    "EXCEPTION": 2,
    "EXECUTION": 3,
    "JSON": 4,
};

const LINE_TYPE_DELIMITER = {
    "VARIABLE": "#",
    "EXCEPTION": "?",
    "JSON": "{",
    "UNIQUE_ID": "@",
};

export {LINE_TYPE, LINE_TYPE_DELIMITER};
