import { Socket } from "socket.io";
import elasticsearch from "../elasticsearch/elasticsearch.js";
import intent from "../intents/intent.js";
import bot from "./bot.js";
import BOT_CONSTANTS from "../shared/constants/bot.js";
import MESSAGE_CONSTANTS from "../shared/constants/message.js";

/**
 * Process the message and perform different actions
 * based on the intent of the message
 * @param {Socket} socket
 * @param {{message: String, sender_id: String, sender_name: String, created_at: String, original_sender: String}} payload
 */
async function processMessage(socket, payload) {
    try {
        socket.broadcast.emit(
            MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.broadcast,
            payload
        );
        const messageIntent = intent.getIntent(payload.message);
        let message;
        if (
            messageIntent === intent.INTENTS.chatbot ||
            messageIntent === intent.INTENTS.question
        ) {
            if (messageIntent === intent.INTENTS.chatbot) {
                message = await bot.sendMessageToBot(payload.message);
            } else if (messageIntent === intent.INTENTS.question) {
                message = await elasticsearch.performElasticSearch(
                    payload.message
                        .toLowerCase()
                        .replace(intent.INTENT_RECOGNIZER.question, "")
                );
            }
            payload.message = message;
            payload.sender_name = BOT_CONSTANTS.BOT_USER.name;
            payload.sender_id = BOT_CONSTANTS.BOT_USER.id;
            // boradcast it to other clients
            socket.broadcast.emit(
                MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.broadcast,
                payload
            );
            //send the bot message to the client who requested it
            socket.emit(
                MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.bot_reply,
                payload
            );
        }
    } catch (e) {
        console.error("Failed to process message", e);
    }
}
/**
 * Generate greeting message for a new user
 * and broadcast it to the channel
 * @param {Socket} socket
 * @param {{message: String, sender_id: String, sender_name: String, created_at: String, original_sender: String}} payload
 */
async function sendGreeting(socket, payload) {
    try {
        const message = await bot.sendMessageToBot(payload.message);
        const replyMessage = {
            message,
            sender_name: BOT_CONSTANTS.BOT_USER.name,
            sender_id: BOT_CONSTANTS.BOT_USER.id,
            created_at: new Date().toString(),
        };
        //broadcast the message for other users
        socket.broadcast.emit(
            MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.broadcast,
            replyMessage
        );
        // send the message to the user who joined
        socket.emit(
            MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.bot_reply,
            replyMessage
        );
    } catch (e) {
        console.error("Error sending greeting message", e);
    }
}

export default {
    processMessage,
    sendGreeting,
    MESSAGE_CONSTANTS,
};
