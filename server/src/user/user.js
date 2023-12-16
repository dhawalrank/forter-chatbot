import USER_CONSTANTS from "../shared/constants/user.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Generate a random user name from a list of pre-configured users
 * @returns {String}
 */
function generateRandomName() {
    const randomIndex = Math.floor(
        Math.random() * USER_CONSTANTS.FIRST_NAME_LIST.length
    );
    return `${USER_CONSTANTS.FIRST_NAME_LIST[randomIndex]} ${USER_CONSTANTS.LAST_NAME_LIST[randomIndex]}`;
}

/**
 * As we dont have registeration of a user in our app, we use this function to
 * register a new user when a new tab is opened
 * @returns {{}}
 */
function generateNewUser() {
    return {
        name: generateRandomName(),
        id: uuidv4(),
    };
}

export default {
    generateNewUser,
};
