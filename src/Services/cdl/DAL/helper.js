/**
 * Builds a response object with the provided
 * id and arguments.
 * @param {String} id
 * @param {Object} args
 * @return {Object}
 */
export const buildResponse = (id, args) => {
    return {
        "id": id,
        "args": args,
    };
};

/**
 * Generates a simple random UID.
 * @return {String}
 */
export const getSimpleUID = () => {
    return Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10);
};
