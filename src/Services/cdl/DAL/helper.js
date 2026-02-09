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
 * Generates a random UID.
 * @return {String}
 */
export const getSimpleUID = () => {
    return crypto.randomUUID();
};
