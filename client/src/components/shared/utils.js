import { LitElement } from "lit";
import constants from "./constants";

/**
 * Load a JS script
 * @param {String} url
 * @returns {HTMLElement}
 */

function loadScript(url) {
    const script = document.createElement("script");
    script.src = url;
    return script;
}
/**
 * Get item from local storage and
 * try to convert it to JSON object
 * @param {String} key
 * @returns {Object|String}
 */
function getLocalStorageItem(key) {
    const value = localStorage.getItem(key);
    if (value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.log(e);
            return value;
        }
    }
    return value;
}
/**
 * Set item to local storage, If the value is object
 * then we convert it to JSON before storing it
 * @param {String} key
 * @param {String|Object} value
 */
function setLocalStorageItem(key, value) {
    if (typeof value === "object") {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.setItem(key, value);
    }
}
/**
 * Get item from session storage and
 * try to convert it to JSON object
 * @param {String} key
 * @returns {String | Object}
 */
function getSessionStorageItem(key) {
    const value = sessionStorage.getItem(key);
    if (value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return value;
}
/**
 * Set item to session storage, If the value is object
 * then we convert it to JSON before storing it
 * @param {String} key
 * @param {String|Object} value
 */
function setSessionStorageItem(key, value) {
    if (typeof value === "object") {
        sessionStorage.setItem(key, JSON.stringify(value));
    } else {
        sessionStorage.setItem(key, value);
    }
}
/**
 * Scroll to bottom of the page
 * @param {LitElement} component
 */
function scrollToBottom(component) {
    setTimeout(() => {
        const scrollableElement =
            component.shadowRoot.getElementById("chat-window-card");
        if (scrollableElement) {
            scrollableElement.scrollTo({
                top: scrollableElement.scrollHeight,
                behavior: "smooth",
            });
        }
    }, 1);
}
/**
 * Get messages stored in the localstorage
 * @returns {Array}
 */
function getSavedMessages() {
    return getLocalStorageItem("messages") || [];
}

/**
 * Save messages to local storage
 * @param {Array} messages
 */
function saveMessages(messages) {
    setLocalStorageItem("messages", messages);
}

/**
 * Format date to display the message received at in chat box
 * @param {string} datetime
 * @returns {String}
 */
function getFormattedDateTime(datetime) {
    const dateTimeObj = new Date(datetime);
    const date =
        dateTimeObj.getFullYear() +
        dateTimeObj.getMonth() +
        dateTimeObj.getDate();

    const today = new Date();
    const formattedToday =
        today.getFullYear() + today.getMonth() + today.getDate();

    const hours = dateTimeObj.getHours();
    const minutes = dateTimeObj.getMinutes();

    // Format the hours and minutes to ensure they have leading zeros if needed
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const time = `${formattedHours}:${formattedMinutes}`;

    if (date === formattedToday) {
        return time;
    }
    return `${dateTimeObj.getDate()}-${dateTimeObj.getMonth()}-${dateTimeObj.getFullYear()} ${time}`;
}

/**
 * Fetch unanswered question from backend
 * @returns {Promise<Array>}
 */
async function fetchUnAnsweredQuestions() {
    const response = await fetch(
        `${constants.BACKEND_CONFIG.host}/questions/unanswered-questions`
    );
    return await response.json();
}
/**
 * Add an answer to an unanswered question
 * @param {String} id
 * @param {String} answer
 * @param {String} question
 * @returns {Promise}
 */
async function addAnswer(id, answer, question) {
    const user = getUser();
    const response = await fetch(
        `${constants.BACKEND_CONFIG.host}/questions/${id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                answer,
                sender_name: user.name,
                sender_id: user.id,
                question,
            }),
        }
    );
    const data = await response.json();
    if (response.status !== 200) {
        throw new Error(data);
    }
}
/**
 * Get CSS class for message list item element
 * @param {String} sender_id
 * @returns
 */
function getMessageListItemClass(sender_id) {
    const user = getUser();
    if (!user) {
        return "";
    }
    return user.id === sender_id ? "chat-right row-reverse" : "chat-left";
}
/**
 * Get initials to display in the avatar circle
 * @param {String} sender_name
 * @returns
 */
function getMessageAvatar(sender_name) {
    const tokenized = sender_name.split(" ");
    return `${tokenized[0][0]}${tokenized[1][0]}`;
}
/**
 * Get extra headers required to make a socket connection
 * to the backend
 * @returns {Object}
 */
function getSocketConnectionExtraHeaders() {
    return {
        extraHeaders: {
            "Access-Control-Allow-Origin": "*",
        },
        query: {
            data: JSON.stringify(getUser()),
        },
    };
}
/**
 * Set user in session storage
 * @param {Object} user
 */
function setUser(user) {
    setSessionStorageItem("user", user);
}
/**
 * Get user from session storage
 * @returns {Object}
 */
function getUser() {
    return getSessionStorageItem("user");
}

/**
 * Generate welcome message to be sent to bot
 * for giving welcoming message to the user
 * @param {String} user
 * @returns
 */
function getDefaultWelcomeMessage(user) {
    return `Hi I am ${user}. Welcome me to forter chatroom using my name but only in 2 lines!`;
}
/**
 * Get user's first name from full name
 * @param {String} message
 * @returns {String}
 */
function getSenderName(message) {
    const user = getUser();
    if (!user) {
        return "";
    }
    if (user.id === message.sender_id) {
        return "You";
    }
    return message.sender_name.split(" ")[0];
}
export default {
    loadScript,
    getSavedMessages,
    saveMessages,
    getFormattedDateTime,
    scrollToBottom,
    fetchUnAnsweredQuestions,
    addAnswer,
    getMessageListItemClass,
    getMessageAvatar,
    getSocketConnectionExtraHeaders,
    setUser,
    getUser,
    getDefaultWelcomeMessage,
    getSenderName,
};
