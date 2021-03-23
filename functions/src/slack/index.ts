import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { App, ExpressReceiver } from "@slack/bolt";

import { logIt } from "../utils";
import { SLACK_STATE_SECRET } from "../constants";

const config = functions.config();
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
  clientId: config.slack.client_id,
  clientSecret: config.slack.client_secret,
  endpoints: "/events", // instead of slack/events
  scopes: ["channels:join", "channels:read", "chat:write", "commands"],
  signingSecret: config.slack.signing_secret,
  stateSecret: SLACK_STATE_SECRET,
  processBeforeResponse: true,
  installationStore,
  // logLevel: LogLevel.DEBUG,
});

const app = new App({
  // token: config.slack.token, // disabled so this app can support multi-tenancy
  signingSecret: config.slack.signing_secret,
  processBeforeResponse: true,
  clientId: config.slack.client_id,
  clientSecret: config.slack.client_secret,
  stateSecret: SLACK_STATE_SECRET,
  scopes: ["channels:join", "channels:read", "chat:write", "commands"],
  installationStore,
  // logLevel: LogLevel.DEBUG,
  receiver: expressReceiver,
});

// Global error handler
app.error(console.error as any);

// Handle `/echo` command invocations
app.command(
  "/enps2",
  async ({ command, ack, say, payload, client, context }) => {
    // Acknowledge command request
    logIt("=========================");
    logIt("command");
    logIt(command);
    logIt("=========================");
    logIt("payload");
    logIt(payload);
    logIt("=========================");
    logIt("client");
    logIt(client);
    logIt("=========================");
    logIt("context");
    logIt(context);
    await ack();

    // Requires:
    // Add chat:write scope + invite the bot user to the channel you run this command
    // Add chat:write.public + run this command in a public channel
    await say(`You said "${command.text}"`);
  }
);

// https://{your domain}.cloudfunctions.net/slack/events
export const slack = functions.https.onRequest(expressReceiver.app);
