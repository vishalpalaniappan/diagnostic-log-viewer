/**
 * Stringify an object with stable key ordering.
 * @param {Object} obj
 * @return {String}
 */
export function stableStringify (obj) {
    return JSON.stringify(
        Object.keys(obj)
            .sort()
            .reduce((o, k) => (o[k] = obj[k], o), {})
    );
}
