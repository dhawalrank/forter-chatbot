import INTENT_CONSTANTS from "../shared/constants/intents.js";

/**
 * Get intent of input string to check weather it is a
 * question or is it requesting chatbot response
 * @param {String} inputString
 * @returns {String}
 */
function getIntent(inputString) {
    inputString = inputString.toLowerCase();
    const isIntentFun = inputString.includes("forterchatbot: ");
    if (isIntentFun) {
        return INTENT_CONSTANTS.INTENTS.chatbot;
    }
    const isIntentQuestion = inputString.includes("question: ");
    if (isIntentQuestion) {
        return INTENT_CONSTANTS.INTENTS.question;
    }
}

export default {
    INTENTS: INTENT_CONSTANTS.INTENTS,
    getIntent,
};
