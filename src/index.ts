import { App } from "@slack/bolt";
import "dotenv/config";

import { createBoardBlocks } from "./games/tictactoe/ui.js";
import {
    createGame,
    getGame,
    deleteGame,
} from "./games/game-manager.js";
import {
    makeMove,
    makeBotMove,
    checkWinner,
    isBoardFull,
} from "./games/tictactoe/game.js";


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

app.command("/cream-tictactoe", async ({ command, ack, respond }) => {
    await ack();

    const board = createGame(command.user_id);
    await respond({
        response_type: "in_channel",
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `Hey! <@${command.user_id}>! You started a tictactoe game by cream games using /cream-tictactoe! :yeah:`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Tic-Tac-Toe*\n\n<@${command.user_id}> :X: vs :neobot: Bot :O:`
                },
            },
            ...createBoardBlocks(board),
        ],
    });
});

app.action(/^ttt_\d_\d$/, async ({ ack, body, respond }) => {
    await ack();

    if (body.type !== "block_actions") {
        return;
    }

    const action = body.actions[0];

    if (!("value" in action) || !action.value) {
        return;
    }

    const [row, col] = action.value.split(",").map(Number);

    const userId = body.user.id;

    const board = getGame(userId);

    if (!board) return;

    const success = makeMove(board, row, col, "X");

    if (!success) return;

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
            ],
        })
    }

    if (isBoardFull(board)) {
        await respond({
            replace_original: true,
            text: "Tic Tac Toe",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "Well,... its a draw :pf:"
                    },
                },
                ...createBoardBlocks(board),
            ],
        });
    }

    makeBotMove(board);

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
                        text: `*Neobot beat you :xdd:!* Better luck next time noob!`,
                    },
                },
                ...createBoardBlocks(board),
            ],
        });

        return;
    }

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
                        text: `*Uhhg it's a draw. :noooo: *`,
                    },
                },
                ...createBoardBlocks(board),
            ],
        });

        return;
    }


    await respond({
        replace_original: true,
        text: "Tic Tac Toe",
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Tic-Tac-Toe*\n\n<@${userId}> :X: vs :neobot: Bot :O:`
                },
            },
            ...createBoardBlocks(board),
        ],
    });
});

(async () => {
    await app.start();
    console.log("App running!");
})();