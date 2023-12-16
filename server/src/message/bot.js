import SendBird from "sendbird";
import utils from "../shared/utils.js";
import config from "../../config.json" assert { type: "json" };
const APP_ID = config.sendbird.app_id;
const API_TOKEN = config.sendbird.api_token;
const BOT_ID = config.sendbird.bot_id;
const sendbird = new SendBird({ appId: APP_ID });

let channel = null;
/**
 * Main function which establishes connection to sendbird
 * and creates a group channel
 */
async function main() {
    const user = await connectSendBirdSync();
    sendbird.re;
    const params = new sendbird.GroupChannelParams();
    params.addUserIds([user.userId, BOT_ID]);
    params.isDistinct = true;
    params.name = new Date().toString();
    channel = await createChannelSync(params);
}

/**
 * Generate message from bot
 * @param {String}} message
 * @param {String} message
 */
async function sendMessageToBot(message) {
    // Send a message to the bot
    await sendUserMessageSync(message);
    let botResponse = null;
    let triesLeft = 5;
    while (triesLeft !== 0 && !botResponse) {
        triesLeft -= 1;
        await utils.sleep(3000);
        if (!botResponse) {
            botResponse = await createPreviousMessageListQueryLoadSyns(1, true);
        }
    }
    if (botResponse) {
        return botResponse;
    }
}
/**
 * Convert sendUserMessage function to promise based
 * from callback function
 * @param {String} message
 * @returns {Promise}
 */
function sendUserMessageSync(message) {
    return new Promise((resolve, reject) => {
        channel.sendUserMessage(message, (message, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(message);
            }
        });
    });
}
/**
 * Convert createPreviousMessageListQuery.load function to promise based
 * from callback based function
 * @param {Number} limit
 * @param {Boolean} reverse
 * @returns {Promise}
 */
function createPreviousMessageListQueryLoadSyns(limit, reverse) {
    return new Promise((resolve, reject) => {
        channel
            .createPreviousMessageListQuery()
            .load(limit, reverse, (messages, error) => {
                if (error) {
                    reject(error);
                } else {
                    // Find the bot's response among the messages
                    const botResponse = messages.find(
                        (msg) => msg.sender.userId === BOT_ID
                    );
                    if (botResponse) {
                        resolve(botResponse.message);
                    } else {
                        resolve(null);
                    }
                }
            });
    });
}

/**
 * Convert sendbird.connect function to
 * promise based from callback based function
 * @returns Promise
 */
async function connectSendBirdSync() {
    return new Promise((resolve, reject) => {
        sendbird.connect(API_TOKEN, (user, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
}

/**
 * Convert createChannel function to promise based
 * from callback based function
 * @param {{}} params
 * @returns
 */
async function createChannelSync(params) {
    return new Promise((resolve, reject) => {
        sendbird.GroupChannel.createChannel(params, (channel, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(channel);
            }
        });
    });
}
let connectRetries = 3;
while (!channel && connectRetries !== 0) {
    main();
    connectRetries -= 1;
    utils.sleep(10000);
}
export default {
    sendMessageToBot,
};
