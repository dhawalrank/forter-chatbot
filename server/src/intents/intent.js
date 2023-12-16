import INTENT_CONSTANTS from "../shared/constants/intents.js";

/**
 * Get intent of input string to check weather it is a
 * question or is it requesting chatbot response
 * @param {String} inputString
 * @returns {String}
 */
function getIntent(inputString) {
    inputString = inputString.toLowerCase();
    if (inputString.includes(INTENT_CONSTANTS.INTENT_RECOGNIZER.chatbot)) {
        return INTENT_CONSTANTS.INTENTS.chatbot;
    }
    if (inputString.includes(INTENT_CONSTANTS.INTENT_RECOGNIZER.question)) {
        return INTENT_CONSTANTS.INTENTS.question;
    }
}

export default {
    INTENTS: INTENT_CONSTANTS.INTENTS,
    INTENT_RECOGNIZER: INTENT_CONSTANTS.INTENT_RECOGNIZER,
    getIntent,
};
