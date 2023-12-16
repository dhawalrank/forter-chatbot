import { LitElement, html } from "lit";
import style from "./chat-window.css.js";
import utils from "../shared/utils.js";
import constants from "../shared/constants.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import emoji from "../shared/emoji.js";

export class ChatWindow extends LitElement {
    static get properties() {
        return {
            /**
             * List of the messages in current session
             * @type {Array}
             */
            messages: { type: Array },
            /**
             * Message being typed in the text area field
             * @type {String}
             */
            message: { type: String },
            /**
             * hide/show answer form
             * @type {Boolean}
             */
            showQAForm: { type: Boolean },
            /**
             * Store unanswered question
             * @type {Array}
             */
            questions: { type: Array },
            /**
             * Stores selected question id
             * @type {String}
             */
            selectedQuestion: { type: String },
            /**
             * Stores answer for the selected question
             * @type {String}
             */
            answer: { type: String },
        };
    }
    constructor() {
        super();
        this.messages = utils.getSavedMessages();
        this.message = "";
        this.showQAForm = false;
        this.questions = [];
        this.selectedQuestion = "";
        this.answer = "";
        this.setupSocketConnection();
    }
    /**
     * Setup socket & register events
     */
    setupSocketConnection() {
        this.socket = io(
            constants.BACKEND_CONFIG.host,
            utils.getSocketConnectionExtraHeaders()
        );

        this.socket.on(constants.MESSAGE_EVENT_NAMES.connected, (payload) => {
            if (payload && !utils.getUser()) {
                // this means a new user is requesting a connection so we would store user id to session
                utils.setUser(payload);
                this.socket.emit(
                    constants.MESSAGE_EVENT_NAMES.message_greeting,
                    { message: utils.getDefaultWelcomeMessage(payload.name) }
                );
            }
            this.socket.off(constants.MESSAGE_EVENT_NAMES.bot_reply);
            this.socket.off(constants.MESSAGE_EVENT_NAMES.broadcast);
            this.socket.on(constants.MESSAGE_EVENT_NAMES.broadcast, (payload) =>
                this.receiveBroadcastedMessage(payload)
            );
            this.socket.on(
                constants.MESSAGE_EVENT_NAMES.bot_reply,
                (payload) => {
                    this.handleBotReply(payload);
                }
            );
        });
    }
    /**
     * Handle event when user clicks on
     * Anser a question button. In this function
     * we fetch all the questions and set showQAForm to true
     */
    async handleAnswerRequest() {
        try {
            const questions = await utils.fetchUnAnsweredQuestions();
            if (questions.length > 0) {
                this.showQAForm = true;
                this.questions = questions;
            }
            utils.scrollToBottom(this);
        } catch (error) {
            console.error("Failed to fetch unanswered questions", error);
        }
    }
    /**
     * Function to handle when a bot replies with a message
     * to the sender who is expecting a reply from the bot
     * @param {{message: String, sender_id: String, sender_name: String, created_at: String, original_sender: String}} payload
     */
    handleBotReply(payload) {
        this.messages = [...this.messages, payload];
        utils.scrollToBottom(this);
        utils.saveMessages(this.messages);
    }
    /**
     * Function to handle receipt of
     * broadcasted message in all the receivers
     * @param {{message: String, sender_id: String, sender_name: String, created_at: String, original_sender: String}} payload
     */
    receiveBroadcastedMessage(payload) {
        const user = utils.getUser();
        if (
            user &&
            (payload.sender_id !== user.id ||
                payload.original_sender === user.id)
        ) {
            //if the user is not sender then we update the state to reflect localstorage
            this.messages = [...this.messages, payload];
            if (payload.original_sender === user.id) {
                utils.saveMessages(this.messages);
            }
            utils.scrollToBottom(this);
        }
    }
    /**
     * Emit event for sending the message and scroll to bottom of the chat
     * @param {{message: String, sender_id: String, sender_name: String, created_at: String, original_sender: String}} payload
     */
    sendMessage(message) {
        this.socket.emit(constants.MESSAGE_EVENT_NAMES.message_sent, message);
        utils.scrollToBottom(this);
    }
    /**
     * Scroll to bottom when we update the state
     */
    connectedCallback() {
        super.connectedCallback();
        utils.scrollToBottom(this);
    }
    /**
     * Update message in state as we type in the message field
     * @param {Event} event
     */
    handleMessageChange(event) {
        this.message = event.target.value;
    }
    /**
     * Send message
     * @returns  {void}
     */
    handleMessageSend() {
        if (!this.message.trim()) {
            return;
        }
        const user = utils.getUser();
        const message = {
            sender_name: user.name,
            sender_id: user.id,
            message: this.message,
            created_at: new Date().toString(),
        };
        this.messages = [...this.messages, message];
        this.sendMessage(message);
        this.message = "";
        utils.saveMessages(this.messages);
    }
    /**
     * handle key press event
     * @param {Event} event
     * @param {Function} cb
     * @returns
     */
    handleKeyPress(event, cb) {
        if (event.shiftKey && event.key === "Enter") {
            // Handle Shift + Enter key press logic here
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            cb();
        }
    }
    /**
     * Display formatted chat message
     * @param {String} message
     * @returns {Event}
     */
    displayFormattedMessage(message) {
        const tokenized = message.split("\n");
        return html`
            ${tokenized.map((aToken, i) => {
                const htmlArr = [];
                htmlArr.push(
                    html`<span
                        >${unsafeHTML(emoji.convertEmojisToHTML(aToken))}</span
                    >`
                );
                if (i < tokenized.length) {
                    htmlArr.push(html`<br />`);
                }
                return htmlArr;
            })}
        `;
    }
    /**
     * Handle event for question selecting
     * @param {Event} event
     */
    handleQuestionSelect(event) {
        this.selectedQuestion = event.target.value;
    }
    /**
     * Handle event for answer change
     * @param {Event} event
     */
    handleAnswerChange(event) {
        this.answer = event.target.value;
    }
    /**
     * Handle submission of an answer.
     * We will also call function to add the answer to elastic
     */
    async handleSubmitAnswer() {
        try {
            const question = this.questions.find(
                (aQuestion) => aQuestion.id === this.selectedQuestion
            );
            await utils.addAnswer(
                this.selectedQuestion,
                this.answer,
                question.question
            );
            this.hideQAForm();
        } catch (error) {
            console.error("Failed to submit answer", error);
        }
    }
    /**
     * Hide answer form
     */
    hideQAForm() {
        this.showQAForm = "";
        this.questions = [];
    }
    /**
     * Render answer form
     * @returns {HTMLElement}
     */
    renderQAForm() {
        if (!this.showQAForm || this.questions.length <= 0) {
            return html``;
        }
        this.selectedQuestion = this.questions[0].id;
        return html`
            <select
                class="form-select form-control mb-1"
                @change="${this.handleQuestionSelect}"
            >
                ${this.questions.map(
                    (question) =>
                        html`
                            <option
                                value="${question.id}"
                                ?selected="${this.selectedQuestion ===
                                question.id}"
                            >
                                ${question.question}
                            </option>
                        `
                )}
            </select>
            <textarea
                .value=${this.answer}
                @input=${this.handleAnswerChange}
                @keydown=${(e) =>
                    this.handleKeyPress(e, () => this.handleSubmitAnswer())}
                class="form-control mb-2"
                rows="3"
                placeholder="Type your answer here..."
            ></textarea>
            <button
                @click=${this.handleSubmitAnswer}
                type="button"
                class="btn btn-success mb-3"
            >
                Submit
            </button>
            <button
                @click=${this.hideQAForm}
                type="button"
                class="btn btn-danger mb-3"
            >
                Cancel
            </button>
        `;
    }

    static styles = [style];

    render() {
        return html`
            <div class="container container-custom">
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
                />
                <link
                    href="http://fonts.googleapis.com/css?family=Roboto"
                    rel="stylesheet"
                    type="text/css"
                />
                <div class="content-wrapper">
                    <div class="row gutters">
                        <div
                            class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
                        >
                            <div class="card m-0" id="chat-window-card">
                                <div class="row no-gutters row-custom">
                                    <div
                                        class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
                                    >
                                        <div class="chat-container">
                                            <ul class="chat-box">
                                                ${this.messages.map(
                                                    (message) =>
                                                        html`
                                                            <li
                                                                class=${utils.getMessageListItemClass(
                                                                    message.sender_id
                                                                )}
                                                            >
                                                                <div
                                                                    class="chat-avatar"
                                                                >
                                                                    <div
                                                                        class="initial"
                                                                    >
                                                                        ${utils.getMessageAvatar(
                                                                            message.sender_name
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        class="chat-name"
                                                                    >
                                                                        ${utils.getSenderName(
                                                                            message
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    class="chat-text"
                                                                >
                                                                    ${this.displayFormattedMessage(
                                                                        message.message
                                                                    )}
                                                                </div>
                                                                <div
                                                                    class="chat-hour"
                                                                >
                                                                    ${utils.getFormattedDateTime(
                                                                        message.created_at
                                                                    )}
                                                                </div>
                                                            </li>
                                                        `
                                                )}
                                            </ul>
                                            <div
                                                class="row form-group mt-3 mb-0 mr-2 ml-2 actions"
                                            >
                                                <div
                                                    class="col-xl-4 col-lg-4 col-md-5 mb-1"
                                                    style="padding-left: 0px;"
                                                >
                                                    <div
                                                        style="text-decoration: underline; cursor: pointer;"
                                                        @click=${() =>
                                                            this.handleAnswerRequest()}
                                                    >
                                                        Answer a Question
                                                    </div>
                                                    <div>
                                                        ${this.renderQAForm()}
                                                    </div>
                                                </div>
                                                <textarea
                                                    ?disabled=${this.showQAForm}
                                                    @keydown=${(e) =>
                                                        this.handleKeyPress(
                                                            e,
                                                            () =>
                                                                this.handleMessageSend()
                                                        )}
                                                    .value=${this.message}
                                                    @input=${this
                                                        .handleMessageChange}
                                                    class="form-control custom-textarea"
                                                    rows="2"
                                                    placeholder="Type your message here..."
                                                ></textarea>
                                                <button
                                                    ?disabled=${this.showQAForm}
                                                    @click=${this
                                                        .handleMessageSend}
                                                    type="button"
                                                    class="btn btn-success ml-3"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${utils.loadScript(
                    "https://code.jquery.com/jquery-1.10.2.min.js"
                )}
                ${utils.loadScript(
                    "https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.bundle.min.js"
                )}
            </div>
        `;
    }
}

window.customElements.define("chat-window", ChatWindow);
