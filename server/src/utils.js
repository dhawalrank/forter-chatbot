/**
 * Sleep for x milliseconds
 * @param {Number} ms
 * @returns {void}
 */

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export default {
    sleep,
};
