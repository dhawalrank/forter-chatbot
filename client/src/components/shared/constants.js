const BOT_USER = {
    name: "Forter Chatbot",
    id: "forter-chatbot",
};
const MESSAGE_EVENT_NAMES = {
    bot_reply: "message:bot_reply",
    message_greeting: "message:greeting",
    message_sent: "message:sent",
    connected: "connected",
    broadcast: "message:broadcast",
};
const BACKEND_CONFIG = {
    host: "http://localhost:3000",
};
export default {
    BOT_USER,
    MESSAGE_EVENT_NAMES,
    BACKEND_CONFIG,
};
