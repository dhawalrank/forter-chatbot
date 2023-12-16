# Forter Chat Bot

Hi there! :)

Your challenge is to build a very simple chat bot web app.

In this repository, you will find working server and client skeletons.

The full challenge description can be found [here](https://docs.google.com/document/d/1g9d3-i1bCUSCMYMcodb_YKX6J8K2QmeVT4S4qUyeZH8/edit?usp=sharing)

Good Luck!

### Using the app

-   Run `npm install` in both client and server to install new libraries.
-   On client side, run `npm run serve` to start the server.
-   On server side, run `npm run start:dev` to start the server.

### Feature List

-   Opening app in a new tab will create a new user and add it to the chat room (user is stored in session storage for ease of use of the app)
-   When a new user joins, the bot triggers a welcome message for the user
-   Message history is stored in localstorage to provide a semi-persistant behaviour (ideally we would have it stored in a database for making it more persistent)
-   To get a response from the bot, type `ForterChatbot: ` followed by a message and the bot will respond to the message
-   To ask a question, type `Question: ` followed by a question. The backend will try to search for an answer in elastic and if not found, it will add the question to list of unanswered questions and the bot will notify the user about it
-   To post a answer, click on `Answer a Question` button above the message textarea

### Bonus features implemented

-   The app uses elastic search's match phrase to search for accurate questions. Other more accurate way to search would be using elastic search's vector search which involves generating vectors using NLP models and storing it in elastic for searching
-   The bot provides funny + informative responses to the user's queries which is perfect mix of work hard & play hard
-   The chat messages supports microinteraction by showing emojis. Some more microinteractions that would be useful here would be reactions to the messages, adding replies, etc
