/**
 * Sleep for x milliseconds
 * @param {Number} ms
 * @returns {Promise}
 */

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Generate generic answer submission response when
 * a user submits an answer
 * @param {String} sender
 * @param {String} question
 * @param {String} answer
 * @returns {String}
 */
function generateAnswerSubmissionResponse(sender, question, answer) {
    return `User ${sender} submitted an answer:\nQuestion: ${question}\nAnswer: ${answer}`;
}
export default {
    sleep,
    generateAnswerSubmissionResponse,
};
