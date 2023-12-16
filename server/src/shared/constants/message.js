const DEFAULT_RESPONSES = {
    no_pending_question: "We do not have any pending questions to be answered.",
    failed_to_fetch_questions:
        "An error occured while fetching unanswered questions, Please try again later!",
    answer_submit_failed:
        "Something went wrong when submitting the answer. Plase try again!",
};

const MESSAGE_EVENT_NAMES = {
    message_greeting: "message:greeting",
    message_sent: "message:sent",
    broadcast: "message:broadcast",
    bot_reply: "message:bot_reply",
    connected: "connected",
};

export default {
    DEFAULT_RESPONSES,
    MESSAGE_EVENT_NAMES,
};
