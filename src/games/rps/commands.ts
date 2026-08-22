import type { App } from "@slack/bolt";

import {
    getBotChoice,
    getResult,
    createScore,
    updateScore,
    isMatchOver,
} from "./game.js";

import type {
    RPSChoice,
    RPSScore,
} from "./game.js";

import { createRPSBlocks } from "./ui.js";


const scores = new Map<string, RPSScore>();


export function startRPS(userId: string) {
    scores.set(userId, createScore());
}


export function registerRPS(app: App) {

    app.action(
        /^rps_(rock|paper|scissors)$/,
        async ({ ack, body, respond }) => {

            await ack();

            if (body.type !== "block_actions") {
                return;
            }

            const action = body.actions[0];

            if (!("value" in action) || !action.value) {
                return;
            }

            const playerChoice = action.value as RPSChoice;
            const botChoice = getBotChoice();
            const userId = body.user.id;

            const result = getResult(
                playerChoice,
                botChoice,
            );


            const score = scores.get(userId);

            if (!score) {
                return;
            }

            updateScore(score, result);

            const matchOver = isMatchOver(score);

            if (matchOver) {

                const playerWon = score.player >= 3;

                const finalMessage = playerWon
                    ? `*YOU WON THE MATCH! LESGOOO :yay:*\n\n`
                    : `*:neobot: NEOBOT WON THE MATCH!* You noob! :loll:\n\n`;


                await respond({
                    replace_original: true,
                    text: "Rock Paper Scissors",
                    blocks: [

                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text:
                                    finalMessage +
                                    `<@${userId}> chose *${playerChoice}*\n` +
                                    `Neobot chose *${botChoice}*\n\n` +
                                    `*Final Score:* ${score.player} — ${score.bot}`,
                            },
                        },

                        {
                            type: "actions",
                            elements: [
                                {
                                    type: "button",
                                    text: {
                                        type: "plain_text",
                                        text: "Play Again?",
                                    },
                                    action_id: "rps_play_again",
                                    value: "play_again",
                                },
                            ],
                        },

                    ],
                });

                scores.delete(userId);

                return;
            }

            let message = "";

            if (result === "win") {

                message =
                    `*You won this round! :yay:*\n\n` +
                    `<@${userId}> chose *${playerChoice}*\n` +
                    `Neobot chose *${botChoice}*\n\n` +
                    `*Score:* <@${userId}>: ${score.player} — Neobot: ${score.bot}`;

            } else if (result === "lose") {

                message =
                    `*Neobot beat you noob!! :neobot: :loll:*\n\n` +
                    `<@${userId}> chose *${playerChoice}*\n` +
                    `Neobot chose *${botChoice}*\n\n` +
                    `*Score:* <@${userId}>: ${score.player} — Neobot: ${score.bot}`;

            } else {

                message =
                    `*It's a draw sob.*\n\n` +
                    `You both chose *${playerChoice}*\n\n` +
                    `*Score:* <@${userId}>: ${score.player} — Neobot: ${score.bot}`;
            }

            await respond({
                replace_original: true,
                text: "Rock Paper Scissors",
                blocks: [

                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: message,
                        },
                    },

                    {
                        type: "actions",
                        elements: [
                            {
                                type: "button",
                                text: {
                                    type: "plain_text",
                                    text: "Next Round",
                                },
                                action_id: "rps_play_again",
                                value: "play_again",
                            },
                        ],
                    },

                ],
            });
        },
    );

    app.action(
        "rps_play_again",
        async ({ ack, body, respond }) => {

            await ack();

            if (body.type !== "block_actions") {
                return;
            }

            const userId = body.user.id;

            if (!scores.has(userId)) {
                startRPS(userId);
            }

            await respond({
                replace_original: true,
                text: "Rock Paper Scissors",
                blocks: createRPSBlocks(),
            });
        },
    );
}