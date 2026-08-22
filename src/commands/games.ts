import type { App } from "@slack/bolt";
import {
    getTicTacToeDifficultyBlocks,
} from "../games/tictactoe/commands.js";

export function registerGamesCommand(app: App) {
    app.command("/cream-games", async ({ command, ack, respond }) => {
        await ack();

        const game = command.text.trim().toLowerCase();

        if (!game) {
            await respond({
                response_type: "ephemeral",
                text:
                    "* :neobot: Cream Games*\n\n" +
                    "*Available games:*\n\n" +
                    "`tictactoe` — Play Tic-Tac-Toe against Neobot :yay:\n" +
                    "`rps` — Rock Paper Scissors\n\n" +
                    "Use `/cream-games <game>` to play!",
            });

            return;
        }

        if (game === "tictactoe") {
            await respond({
                response_type: "ephemeral",
                text: "Choose your Tic-Tac-Toe difficulty:",
                blocks: getTicTacToeDifficultyBlocks(),
            });

            return;
        }

        await respond({
            response_type: "ephemeral",
            text:
                `I don't know the game \`${game}\`.?\n\n` +
                "Use `/cream-games` to see the available games.",
        });
    });
}