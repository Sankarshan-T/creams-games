import type { App } from "@slack/bolt";

import {
    getBotChoice,
    getResult,
} from "./game.js";

import type { RPSChoice } from "./game.js";

import { createRPSBlocks } from "./ui.js";

export function registerRPS(app: App) {
    app.action(/^rps_(rock|paper|scissors)$/, async ({ ack, body, respond }) => {
        await ack();
        if (body.type !== "block_actions") return;

        const action = body.actions[0];

        if (!("value" in action) || !action.value) return;

        const playerChoice = action.value as RPSChoice;
        const botChoice = getBotChoice();

        const result = getResult(
            playerChoice,
            botChoice,
        );

        const userId = body.user.id;
        let message = "";

        if (result === "win") {
            message =
                `*You won! :yay: *\n\n` +
                `<@${userId}> chose *${playerChoice}*\n` +
                `Neobot chose *${botChoice} :loll:*`;
        } else if (result === "lose") {
            message =
                `*Neobot beat you noob!! :neobot: *\n\n` +
                `<@${userId}> chose *${playerChoice}*\n` +
                `Neobot chose *${botChoice}*`;
        } else {
            message =
                `*It's a draw sob. *\n\n` +
                `You both chose *${playerChoice}*`;
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
                                text: "Play Again?",
                            },
                            action_id: "rps_play_again",
                            value: "play_again",
                        },
                    ],
                },
            ],
        });
    });

    app.action("rps_play_again", async ({ ack, respond }) => {
        await ack();

        await respond({
            replace_original: true,
            text: "Rock Paper Scissors",
            blocks: createRPSBlocks(),
        });
    });
}