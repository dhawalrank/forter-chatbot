import express from "express";
import httpServer from "http";
import { Server } from "socket.io";
import cors from "cors";
import messageListeners from "./message/listeners.js";
import questionsController from "./controllers/questions.js";
import bodyParser from "body-parser";
import "./message/bot.js";
import user from "./user/user.js";
import MESSAGE_CONSTANTS from "./shared/constants/message.js";

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
const http = httpServer.createServer(app);

http.listen(3000, () => {
    console.log("listening on *:3000");
});

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

io.on("connection", (socket) => {
    const { data } = socket.handshake.query;
    let newUser = JSON.parse(data);
    if (!newUser) {
        newUser = user.generateNewUser();
    } else {
        newUser = null;
    }
    io.emit(MESSAGE_CONSTANTS.MESSAGE_EVENT_NAMES.connected, newUser);
    messageListeners.setupListeners(socket);
    app.get("/questions/unanswered-questions", (req, res) => {
        questionsController.getUnansweredQuestions(req, res, socket);
    });
    app.post("/questions/:id", (req, res) => {
        questionsController.updateUnansweredQuestion(req, res, socket);
    });
});
