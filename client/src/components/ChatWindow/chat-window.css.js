import { css } from "lit";

export default css`
    .container-custom {
        font-family: "Roboto", sans-serif;
        margin-top: 20px;
    }
    .custom-textarea {
        width: calc(100% - 80px);
        font-size: 14px;
    }
    .initial {
        display: flex;
        background-color: lightgrey;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
    }

    /* Different styles for read and unread check marks */
    .checkmark.unread {
        background-color: #ccc; /* Change color for unread */
    }
    .answer-container {
        margin-left: 69px;
        margin-top: -29px;
    }
    .actions {
        margin-top: auto !important;
    }
    .chat-container {
        position: relative;
        padding: 1rem;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .row-reverse {
        justify-content: flex-start !important;
        flex-direction: row-reverse !important;
    }
    .row-custom {
        height: 100%;
    }
    .chat-container li.chat-left,
    .chat-container li.chat-right {
        display: flex;
        flex: 1;
        flex-direction: row;
        margin-bottom: 40px;
    }

    .chat-container li img {
        width: 48px;
        height: 48px;
        -webkit-border-radius: 30px;
        -moz-border-radius: 30px;
        border-radius: 30px;
    }

    .chat-container li .chat-avatar {
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .chat-container li.chat-right {
        justify-content: flex-end;
    }

    .chat-container li.chat-right > .chat-avatar {
        margin-left: 20px;
        margin-right: 0;
    }

    .chat-container li .chat-name {
        font-size: 0.75rem;
        color: #999999;
        text-align: center;
    }

    .chat-container li .chat-text {
        padding: 0.4rem 1rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        background: #ffffff;
        font-weight: 300;
        line-height: 140%;
        position: relative;
        font-size: 14px;
    }

    .chat-container li .chat-text:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: 10px;
        left: -20px;
        border: 10px solid;
        border-color: transparent #ffffff transparent transparent;
    }

    .chat-container li.chat-right > .chat-text {
        text-align: right;
    }

    .chat-container li.chat-right > .chat-text:before {
        right: -20px;
        border-color: transparent transparent transparent #ffffff;
        left: inherit;
    }

    .chat-container li .chat-hour {
        padding: 0;
        margin-bottom: 10px;
        font-size: 0.75rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 0 0 0 15px;
    }

    .chat-container li .chat-hour > span {
        font-size: 16px;
        color: #9ec94a;
    }
    .chat-container li.chat-right > .chat-hour {
        margin: 0 15px 0 0;
    }

    @media (max-width: 767px) {
        .row-reverse {
            flex-direction: column !important;
        }
        .chat-container li.chat-left,
        .chat-container li.chat-right {
            flex-direction: column;
            margin-bottom: 30px;
        }
        .answer-container {
            margin-left: 0;
        }

        .chat-container li img {
            width: 32px;
            height: 32px;
        }

        .chat-container li.chat-left .chat-avatar {
            margin: 0 0 5px 0;
            display: flex;
            align-items: center;
            width: 40px;
        }

        .chat-container li.chat-left .chat-hour {
            justify-content: flex-end;
        }

        .chat-container li.chat-right .chat-avatar {
            order: -1;
            margin: 0 0 5px 0;
            align-items: center;
            display: flex;
            justify-content: right;
            flex-direction: row-reverse;
        }

        .chat-container li.chat-right .chat-hour {
            justify-content: flex-start;
            order: 2;
        }

        .chat-container li.chat-right .chat-name {
            margin-right: 5px;
        }

        .chat-container li .chat-text {
            font-size: 0.8rem;
        }
    }

    .chat-form {
        padding: 15px;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ffffff;
        border-top: 1px solid white;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .card {
        border: 0;
        background: #f4f5fb;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        margin-bottom: 2rem;
        box-shadow: none;
        height: 95vh;
        overflow: auto;
        justify-content: flex-end;
        scroll-behavior: smooth; /* Enable smooth scrolling */
        scroll-margin-block: auto; /* Adjust the space before scrolling */
    }
`;
