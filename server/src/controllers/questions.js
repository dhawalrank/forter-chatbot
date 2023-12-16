import elasticsearch from "../elasticsearch/elasticsearch.js";
import { Socket } from "socket.io";
import MESSAGE_CONSTANTS from "../shared/constants/message.js";
import BOT_CONSTANTS from "../shared/constants/bot.js";
import bot from "../message/bot.js";
import utils from "../shared/utils.js";

/**
 * Controller for fetching all the unanswered questions
 * @param {{}} req
 * @param {{json: Function, status: () => {json: Function}}} res
 * @param {Socket} socket
 */
async function getUnansweredQuestions(req, res, socket) {
    try {
        const questions = await elasticsearch.getUnAnsweredQuestions();
        if (questions.length === 0) {
            let botReply =
                MESSAGE_CONSTANTS.DEFAULT_RESPONSES.no_pending_question;
            try {
                botReply = await bot.sendMessageToBot(
                    BOT_CONSTANTS.BOT_REPHRASES_STATEMENTS
                        .no_pending_question_rephrase
                );
            } catch (e) {}
            const message = {
                message: botReply,
                sender_name: BOT_CONSTANTS.BOT_USER.name,
                sender_id: BOT_CONSTANTS.BOT_USER.id,
                created_at: new Date().toString(),
            };
            socket.broadcast.emit(
                MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.broadcast,
                message
            );
            socket.emit(
                MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.bot_reply,
                message
            );
        }
        res.json(questions);
    } catch (e) {
        console.log(e);
        const message = {
            message:
                MESSAGE_CONSTANTS.DEFAULT_RESPONSES.failed_to_fetch_questions,
            sender_name: BOT_CONSTANTS.BOT_USER.name,
            sender_id: BOT_CONSTANTS.BOT_USER.id,
            createdAt: new Date().toString(),
        };
        socket.broadcast.emit(
            MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.broadcast,
            message
        );
        socket.emit(MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.bot_reply, message);
        res.status(404).json({ message: "Questions not found" });
    }
}
/**
 * Controller for adding answer to a question
 * @param {{params: {id: String}, body: {answer: String, sender_name: String, question: String}}} req
 * @param {{json: Function, status: () => {json: Function, send: Function}}} res
 * @param {Socket} socket
 */
async function updateUnansweredQuestion(req, res, socket) {
    try {
        await elasticsearch.updateDocumentById(req.params.id, req.body.answer);
        const message = {
            message: utils.generateAnswerSubmissionResponse(
                req.body.sender_name,
                req.body.question,
                req.body.answer
            ),
            sender_name: BOT_CONSTANTS.BOT_USER.name,
            sender_id: BOT_CONSTANTS.BOT_USER.id,
            created_at: new Date().toString(),
            original_sender: req.body.sender_id,
        };
        socket.broadcast.emit(
            MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.broadcast,
            message
        );
        res.status(200).send({});
    } catch (e) {
        console.error(e);
        socket.broadcast.emit(
            MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.broadcast,
            MESSAGE_CONSTANTS.DEFAULT_RESPONSES.answer_submit_failed
        );
        res.status(404).json({
            message: "Failed to update answer for the question",
        });
    }
}
export default {
    getUnansweredQuestions,
    updateUnansweredQuestion,
};
