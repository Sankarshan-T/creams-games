import { App } from "@slack/bolt";
import "dotenv/config";

import { registerGamesCommand } from "./commands/games.js";
import { registerTicTacToe } from "./games/tictactoe/commands.js";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

registerGamesCommand(app);
registerTicTacToe(app);

(async () => {
    await app.start();

    console.log("Yooooooo Cream Games is actually running!");
})();