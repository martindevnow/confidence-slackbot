import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { App, ExpressReceiver } from "@slack/bolt";

import { logIt } from "../utils";
import {
  HELP_TEXT,
  SLACK_SCOPES,
  SLACK_STATE_SECRET,
  VALID_SCORES_REGEX,
} from "../constants";
import { postReminder } from "./postReminder";
import { postResults } from "./postResults";
import { persistScore } from "./persistScore";

const CONFIG = functions.config();
// const pubSubClient = new PubSub();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const installationStore = {
  storeInstallation: async (installation: any, logger: any) => {
    // types are a part of @slack/oauth, not bolt..
    logger.info("installation", installation);

    if (installation.isEnterpriseInstall && installation.enterprise?.id) {
      // support for org wide app installation
      await db
        .collection("enterprises")
        .doc(installation.enterprise.id)
        .set(installation);
      return;
    }
    // single team app installation
    if (installation.team?.id) {
      await db.collection("teams").doc(installation.team?.id).set(installation);
      return;
    }
    throw new Error("Failed saving installation data to installationStore");
  },
  fetchInstallation: async (installQuery: any, logger: any) => {
    logger.info("installQuery", installQuery);

    // change the line below so it fetches from your database
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      // org wide app installation lookup
      return await db
        .collection("enterprises")
        .doc(installQuery.enterpriseId)
        .get()
        .then((snapshot) => snapshot.data() as any);
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation lookup
      return await db
        .collection("teams")
        .doc(installQuery.teamId)
        .get()
        .then((snapshot) => snapshot.data() as any);
    }
    throw new Error("Failed fetching installation");
  },
};

const expressReceiver = new ExpressReceiver({
  clientId: CONFIG.slack.client_id,
  clientSecret: CONFIG.slack.client_secret,
  endpoints: "/events", // instead of slack/events
  scopes: SLACK_SCOPES,
  signingSecret: CONFIG.slack.signing_secret,
  stateSecret: SLACK_STATE_SECRET,
  processBeforeResponse: true,
  installationStore,
  // logLevel: LogLevel.DEBUG,
});

const app = new App({
  // token: CONFIG.slack.token, // disabled so this app can support multi-tenancy
  signingSecret: CONFIG.slack.signing_secret,
  processBeforeResponse: true,
  clientId: CONFIG.slack.client_id,
  clientSecret: CONFIG.slack.client_secret,
  stateSecret: SLACK_STATE_SECRET,
  scopes: SLACK_SCOPES,
  installationStore,
  // logLevel: LogLevel.DEBUG,
  receiver: expressReceiver,
});

// Global error handler
app.error(console.error as any);

// Handle `/echo` command invocations
app.command(
  "/conf",
  async ({ command, ack, /*say, payload, */ client, context }) => {
    const commandArgument = command.text;
    functions.logger.info("context");
    functions.logger.info(context);
    logIt("Command Argument", commandArgument);

    // This works. The `botUserId` is what we need to query channels for this user.
    // if (commandArgument === "easterEgg") {
    //   await ack("Just a moment...");
    //   // const team = { id: context.teamId };
    //   const bot = { id: context.botUserId };
    //   await postReminder({ client, bot });
    //   return;
    // }

    if (commandArgument === "reminder") {
      logIt("Dispatching PostReminder");
      await ack("A reminder will be posted to the channel.");
      const channel = { id: command.channel_id };
      // const team = { id: context.teamId };
      const bot = { id: context.botUserId };
      await postReminder({ client, channel, bot });
      return;
    }

    if (commandArgument === "results") {
      logIt("Dispatching PostResults");
      await ack("Last week's results will be posted to the channel.");
      const channel = { id: command.channel_id, name: command.channel_name };
      const team = { id: context.teamId };
      const bot = { id: context.botUserId };
      await postResults({ db, channel, team, client, bot });
      return;
    }

    if (commandArgument === "help") {
      return ack(HELP_TEXT);
    }

    if (VALID_SCORES_REGEX.test(commandArgument)) {
      logIt("Dispatching ScoreReceived");
      await ack("Thank you for submitting!");
      const user = { id: command.user_id };
      const channel = { name: command.channel_name };
      const team = { id: context.teamId };
      await persistScore({ db, text: command.text, user, channel, team });
      return;
    }

    await ack(
      "I didn't recognize that input. Please check your submission or try `/conf help` for more."
    );
    return;
  }
);

// https://{your domain}.cloudfunctions.net/slack/events
export const slack = functions.https.onRequest(expressReceiver.app);
