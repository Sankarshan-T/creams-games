import { App } from "@slack/bolt";
import "dotenv/config";

import {
    createBoard,
    makeMove,
    makeBestBotMove,
    checkWinner,
    isBoardFull,
} from "./games/tictactoe/game.js";

import type { Board } from "./games/tictactoe/game.js";

import { createBoardBlocks } from "./games/tictactoe/ui.js";

import {
    createGame,
    getGame,
    deleteGame,
} from "./games/game-manager.js";


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});


// tictactoe

app.command("/cream-tictactoe", async ({ command, ack, respond }) => {
    await ack();

    const board = createBoard();

    createGame(
        command.user_id,
        "tictactoe",
        board,
    );

    await respond({
        response_type: "in_channel",
        text: `Tic-Tac-Toe started by <@${command.user_id}>`,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `Hey! <@${command.user_id}>! You started a Tic-Tac-Toe game from Cream Games! :yeah:`,
                },
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `<@${command.user_id}> :X: vs :neobot: Bot :O:`,
                },
            },
            ...createBoardBlocks(board),
        ],
    });
});


// tictactoe command action

app.action(/^ttt_\d_\d$/, async ({ ack, body, respond }) => {
    await ack();

    if (body.type !== "block_actions") {
        return;
    }

    const action = body.actions[0];

    if (!("value" in action) || !action.value) {
        return;
    }

    const [row, col] = action.value
        .split(",")
        .map(Number);

    const userId = body.user.id;

    const game = getGame(userId);

    if (!game) {
        return;
    }

    if (game.type !== "tictactoe") {
        return;
    }

    const board = game.state as Board;


    // handles player move

    const success = makeMove(
        board,
        row,
        col,
        "X",
    );

    if (!success) {
        return;
    }


    // did the player win?

    let winner = checkWinner(board);

    if (winner === "X") {
        deleteGame(userId);

        await respond({
            replace_original: true,
            text: "Tic Tac Toe",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*You won!*\n\n<@${userId}> :X: defeated :neobot: Bot :O:`,
                    },
                },

                ...createBoardBlocks(board),

                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Play Again?",
                            },
                            action_id: "ttt_play_again",
                            value: "play_again",
                        },
                    ],
                },
            ],
        });

        return;
    }


    //  checking draw after player moves here

    if (isBoardFull(board)) {
        deleteGame(userId);

        await respond({
            replace_original: true,
            text: "Tic Tac Toe",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `Uhhgg *It's a draw!* :noooo: `,
                    },
                },

                ...createBoardBlocks(board),

                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Play Again?",
                            },
                            action_id: "ttt_play_again",
                            value: "play_again",
                        },
                    ],
                },
            ],
        });

        return;
    }


    // the op bot move
    makeBestBotMove(board);


    //   did the bot win lol?
    winner = checkWinner(board);

    if (winner === "O") {
        deleteGame(userId);

        await respond({
            replace_original: true,
            text: "Tic Tac Toe",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Neobot won with you :bleh: :xdd: !*\n\nBetter luck next time, <@${userId}> noob!`,
                    },
                },

                ...createBoardBlocks(board),

                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Play Again?",
                            },
                            action_id: "ttt_play_again",
                            value: "play_again",
                        },
                    ],
                },
            ],
        });

        return;
    }


    // second draw check after bot plays
    if (isBoardFull(board)) {
        deleteGame(userId);

        await respond({
            replace_original: true,
            text: "Tic Tac Toe",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `Uhhgg *It's a draw!* :noooo: `,
                    },
                },

                ...createBoardBlocks(board),

                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Play Again?",
                            },
                            action_id: "ttt_play_again",
                            value: "play_again",
                        },
                    ],
                },
            ],
        });

        return;
    }

    // continues after all tthe stuff above
    await respond({
        replace_original: true,
        text: "Tic Tac Toe",
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Tic-Tac-Toe*\n\n<@${userId}> :X: vs :neobot: Bot :O:`,
                },
            },

            ...createBoardBlocks(board),
        ],
    });
});

// play again button and stuff
app.action("ttt_play_again", async ({ ack, body, respond }) => {
    await ack();

    if (body.type !== "block_actions") {
        return;
    }

    const userId = body.user.id;

    const board = createBoard();

    createGame(
        userId,
        "tictactoe",
        board,
    );

    await respond({
        replace_original: true,
        text: "Tic Tac Toe",
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*New Game!*\n\n<@${userId}> :X: vs :neobot: Bot :O:`,
                },
            },

            ...createBoardBlocks(board),
        ],
    });
});

(async () => {
    await app.start();

    console.log("Yooooooo Cream Games is actually running!"); // new console log to make it more exciting sob
})();