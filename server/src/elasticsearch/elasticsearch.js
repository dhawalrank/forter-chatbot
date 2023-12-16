import { Client } from "@elastic/elasticsearch";
import bot from "../message/bot.js";
import config from "../../config.json" assert { type: "json" };
import BOT_CONSTANTS from "../shared/constants/bot.js";

/**
 * Connect to elastic
 */
const client = new Client({
    node: config.elasticsearch.api,
    auth: {
        apiKey: config.elasticsearch.api_key,
    },
});

/**
 * Perform elastic search for a message
 * @param {String} message
 * @returns {Promise<String>}
 */
async function performElasticSearch(message) {
    const body = await client.search({
        index: config.elasticsearch.index_name,
        body: {
            query: {
                bool: {
                    should: [
                        {
                            match_phrase: {
                                question: message.toLowerCase(),
                            },
                        },
                        {
                            match_phrase: {
                                answer: message.toLowerCase(),
                            },
                        },
                    ],
                    must_not: {
                        term: { [`answer.keyword`]: "" },
                    },
                },
            },
        },
    });

    let retVal = "";
    if (body.hits.hits.length > 0) {
        retVal = body.hits.hits[0]._source?.answer;
    } else {
        await createQuestionInElastic(message);
        retVal = await bot.sendMessageToBot(
            BOT_CONSTANTS.BOT_REPHRASES_STATEMENTS.question_not_found
        );
    }
    return retVal;
}

/**
 * Create a question in elastic
 * @param {String} question
 * @returns {Promise}
 */
async function createQuestionInElastic(question) {
    //create question in elastic only if its not present in the db currently
    const body = await client.search({
        index: config.elasticsearch.index_name,
        body: {
            query: {
                bool: {
                    should: [
                        {
                            match_phrase: {
                                question: question.toLowerCase(),
                            },
                        },
                    ],
                    must: {
                        term: { [`answer.keyword`]: "" },
                    },
                },
            },
        },
    });
    if (body.hits.hits.length > 0) {
        return;
    }
    await client.index({
        index: config.elasticsearch.index_name,
        body: {
            question,
            answer: "",
        },
    });
}
/**
 * Get all unanswered questions from elastic
 * @returns {Promise<[]>}
 */
async function getUnAnsweredQuestions() {
    const body = await client.search({
        index: config.elasticsearch.index_name,
        body: {
            query: {
                bool: {
                    must: {
                        term: { [`answer.keyword`]: "" },
                    },
                },
            },
        },
    });
    const questions = [];
    if (body.hits.hits.length > 0) {
        body.hits.hits.forEach((hit) => {
            questions.push({
                id: hit._id,
                question: hit._source?.question,
            });
        });
    }
    return questions;
}

/**
 * Update an elastic document by id
 * @param {Number} id
 * @param {String} answer
 */
async function updateDocumentById(id, answer) {
    await client.update({
        index: config.elasticsearch.index_name,
        id,
        body: {
            doc: {
                answer,
            },
        },
    });
}

export default {
    performElasticSearch,
    getUnAnsweredQuestions,
    updateDocumentById,
};
