import { App } from "@slack/bolt";
import "dotenv/config";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
    await app.start(3000);
    console.log("App running");
})();