import { App } from "@slack/bolt";
import "dotenv/config";
import { createBoard } from "./games/tictactoe/game";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

app.command("/cream-tictactoe", async ({ command, ack, respond }) => {
    await ack();

    await respond({
        text: `Hey! <@${command.user_id}>! You started a tictactoe game from cream games! :yeah:`
    });
});

(async () => {
    await app.start(3000);
    console.log("App running!");
})();