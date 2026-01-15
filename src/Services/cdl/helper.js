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

/**
 * Normalize the execution levels given the execution array.
 * @param {Object} execution
 */
export function normalizeExecutionLevels (execution) {
    let minLevel;

    // Find the min levels for each abstraction
    for (let i = 0; i < execution.length; i++) {
        const entry = execution[i];
        if (minLevel === undefined) {
            minLevel = entry.level;
        } else if (minLevel && entry.level < minLevel) {
            minLevel = entry.level;
        }
    }

    // Substract the min level from every entry to normalize it
    for (let i = 0; i < execution.length; i++) {
        const entry = execution[i];
        entry.level = entry.level - minLevel;
    }
}
