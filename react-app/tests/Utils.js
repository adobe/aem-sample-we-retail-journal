

/**
 * Generic observe function
 *
 * @param {function} verify     - function which verify the processed object
 * @param {function} done       - Mocha asynchronous function
 * @returns {Function}
 */
function observe(verify, done) {
    return function (mutationsList) {
        for (let mutation of mutationsList) {
            if (verify(mutation)) {
                done();
                break;
            }
        }
    }
}

/**
 * Provides a MutationObserver instance that allows providing a callback function to verify that a condition is meet before call the provide "done" callback function
 *
 * @param verify    - Callback function to verify a provided condition is meet
 * @param done      - Callback function to be called when the verify function returns a positive value
 * @returns {MutationObserver}
 */
export function getVerifyObserver(verify, done) {
    return new MutationObserver(observe(verify, done));
}