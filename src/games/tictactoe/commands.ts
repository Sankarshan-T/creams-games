import type { App } from "@slack/bolt";

import {
    makeMove,
    makeBestBotMove,
    checkWinner,
    isBoardFull,
    createGameState,
    makeBotMove,
    makeBetterBotMove,
} from "./game.js";

import type { Difficulty, TicTacToeState } from "./game.js";

import { createBoardBlocks } from "./ui.js";

import {
    createGame,
    getGame,
    deleteGame,
} from "../game-manager.js";

export function registerTicTacToe(app: App) {
    // difficulty
    function difficultySelectorBlocks() {
        return [
            {
                type: "section" as const,
                text: {
                    type: "mrkdwn" as const,
                    text:
                        "Tic Tac Toe\n\n" +
                        "Choose your difficulty:\n\n",
                },
            },
            {
                type: "actions" as const,
                elements: [
                    {
                        type: "button" as const,
                        text: {
                            type: "plain_text" as const,
                            text: "🟢 Easy",
                        },
                        action_id: "ttt_difficulty_easy",
                    },
                    {
                        type: "button" as const,
                        text: {
                            type: "plain_text" as const,
                            text: "🟡 Medium",
                        },
                        action_id: "ttt_difficulty_medium",
                    },
                    {
                        type: "button" as const,
                        text: {
                            type: "plain_text" as const,
                            text: "🔴 Hard",
                        },
                        action_id: "ttt_difficulty_impossible",
                    },
                ],
            },
        ];
    }

    app.command("/cream-tictactoe", async ({ command, ack, client }) => {
        await ack();

        await client.chat.postMessage({
            channel: command.channel_id,
            text: "Tic-Tac-Toe: Choose a difficulty",
            blocks: difficultySelectorBlocks(),
        });
    });

    // manages the action buttons for difficuty
    app.action(
        /^ttt_difficulty_(easy|medium|impossible)$/,
        async ({ ack, body, client, respond }) => {
            await ack();

            if (body.type !== "block_actions") {
                return;
            }

            const action = body.actions[0];

            if (!("action_id" in action)) {
                return;
            }

            const difficulty = action.action_id.replace(
                "ttt_difficulty_",
                "",
            ) as Difficulty;

            const userId = body.user.id;

            const state = createGameState(difficulty);

            createGame(
                userId,
                "tictactoe",
                state,
            );

            if (!body.channel) return;

            await client.chat.postMessage({
                channel: body.channel.id,
                text: "Tic Tac Toe",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*Tic-Tac-Toe*\n\n<@${userId}> :X: vs :neobot: Bot :O:\n\nDifficulty: *${difficulty}*`,
                        },
                    },

                    ...createBoardBlocks(state.board),
                ],
            });

            if (body.message?.ts && body.channel?.id) {
                await client.chat.delete({
                    channel: body.channel.id,
                    ts: body.message.ts,
                });
            }
        },
    );

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

        const state = game.state as TicTacToeState;

        const board = state.board;
        const difficulty = state.difficulty;


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
                            text: `*You won!*\n\n<@${userId}> :X: defeated :neobot: Bot :O:\n\n Difficulty: *${difficulty}*`,
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
                            text: `Uhhgg *It's a draw!* :noooo: \n\n Difficulty: *${difficulty}* `,
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
        if (difficulty === "easy") makeBotMove(board);
        else if (difficulty === "medium") makeBetterBotMove(board);
        else makeBestBotMove(board);



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
                            text: `*Neobot won with you :bleh: :xdd: !*\n\nBetter luck next time, <@${userId}> noob!\n\n Difficulty: *${difficulty}*`,
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
                            text: `Uhhgg *It's a draw!* :noooo: \n\n Difficulty: *${difficulty}*`,
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
                        text: `*Tic-Tac-Toe*\n\n<@${userId}> :X: vs :neobot: Bot :O: \n\n Difficulty: *${difficulty}*`,
                    },
                },

                ...createBoardBlocks(board),
            ],
        });
    });

    // play again button functions and stuff
    app.action("ttt_play_again", async ({ ack, body, respond }) => {
        await ack();

        if (body.type !== "block_actions") {
            return;
        }

        await respond({
            replace_original: true,
            text: "Choose a Tic-Tac-Toe difficulty",
            blocks: difficultySelectorBlocks(),
        });
    });


}