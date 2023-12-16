import { Socket as socket } from "socket.io";
import messageProcessor from "./processor.js";

/**
 * Register socket events for
 * different types of messages
 * @param {socket} socket
 */
function setupListeners(socket) {
    socket.on(
        messageProcessor.MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.message_greeting,
        (payload) => messageProcessor.sendGreeting(socket, payload)
    );
    socket.on(
        messageProcessor.MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.message_sent,
        (payload) => messageProcessor.processMessage(socket, payload)
    );
}

export default {
    setupListeners,
};
