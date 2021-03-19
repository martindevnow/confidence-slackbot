// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

import * as functions from "firebase-functions";
import { PubSub } from "@google-cloud/pubsub";
import admin from "firebase-admin";

import { getYearWeekString, logIt } from "./utils";
import { ENPS_PUBSUB_TOPICS, SlashCommand } from "./types";
import { legitSlackRequest } from "./verify";
// import { WebClient } from "@slack/web-api";

admin.initializeApp();

const db = admin.firestore();
// const bot = new WebClient(functions.config().slack.token);
const pubSubClient = new PubSub();

const validScoresRegex = /^((1[0-9])|([1-9])) ((1[0-9])|([1-9]))$/;

/**
 * Default function to validate with Slack
 */
export const validateChallenge = functions.https.onRequest(async (req, res) => {
  const { challenge } = req.body;
  res.send({ challenge });
});

/**
 * The cloud function that Slack Commands `/enps ...` are sent to.
 */
export const slackSlashCommand = functions.https.onRequest(async (req, res) => {
  logIt("/enps command received ...");

  // TODO: Support more commands
  // /enps help
  // /enps remind
  // /enps results
  // /enps 10 10
  // /enps 10 (same for both)

  // Verify Signature
  const valid = legitSlackRequest(req);
  if (!valid) {
    console.error("Failed Validation Check on Secret");
    res.sendStatus(403);
    return;
  }

  const command = req.body as SlashCommand;
  const commandArgument = command.text;
  logIt("Command Argument", commandArgument);

  // if (commandArgument === "reminder") {
  //   const data = JSON.stringify({
  //     channel: { id: command.channel_id },
  //   });
  //   const dataBuffer = Buffer.from(data);
  //   await pubSubClient
  //     .topic(ENPS_PUBSUB_TOPICS.PostReminder)
  //     .publish(dataBuffer);
  //   res.send(200);
  //   return;
  // }

  // if (commandArgument === "results") {
  //   const data = JSON.stringify({
  //     channel: { id: command.channel_id, name: command.channel_name },
  //   });
  //   const dataBuffer = Buffer.from(data);
  //   await pubSubClient
  //     .topic(ENPS_PUBSUB_TOPICS.PostResults)
  //     .publish(dataBuffer);
  //   res.send(200);
  //   return;
  // }

  if (validScoresRegex.test(commandArgument)) {
    const dataStr = JSON.stringify(command);
    const dataBuffer = Buffer.from(dataStr);

    logIt("Publishing event to pubsub ...");
    await pubSubClient
      .topic(ENPS_PUBSUB_TOPICS.ScoreReceived)
      .publish(dataBuffer);
    res.sendStatus(200);
    return;
  }

  res.status(200).send("Here is some help");
  return;
});

/**
 * Function to run weekly and remind channels
 * (where the app is installed)
 * to submit their eNPS scores for the week
 *
 * CRON :: `5 14 * * 5` = at 14:05 on Fridays
 */
// export const postEndOfWeekReminderMessage = functions.pubsub
//   .schedule("5 14 * * 5") // 2:05 PM on Fridays
//   .timeZone("America/New_York")
//   .onRun(async (context) => {
//     // Don't set channel to post to all channels
//     const dataStr = JSON.stringify({ all: true });
//     const dataBuffer = Buffer.from(dataStr);

//     await pubSubClient
//       .topic(ENPS_PUBSUB_TOPICS.PostReminder)
//       .publish(dataBuffer);
//   });

/**
 * Function to run weekly and update channels
 * on what the eNPS score from the previous week was
 */
// export const postBeginningOfWeekScoreUpdate = functions.pubsub
//   .schedule("5 10 * * 2") // 10:05 AM on Tuesdays
//   .timeZone("America/New_York")
//   // .schedule("every 5 minutes")
//   .onRun(async (context) => {
//     // Don't set channel to post to all channels
//     const dataStr = JSON.stringify({ all: true });
//     const dataBuffer = Buffer.from(dataStr);
//     await pubSubClient
//       .topic(ENPS_PUBSUB_TOPICS.PostResults)
//       .publish(dataBuffer);
//   });

// export * from "./pubsub/reminderMessage";
// export * from "./pubsub/resultsMessage";

/**
 * Handle the Slash Commands in PubSub
 */
export const scoreReceivedPubsub = functions.pubsub
  .topic(ENPS_PUBSUB_TOPICS.ScoreReceived)
  .onPublish(async (message, context) => {
    const slashCommand = message.json as SlashCommand;

    logIt(ENPS_PUBSUB_TOPICS.ScoreReceived, slashCommand);
    const score = +slashCommand.text;
    const timestamp = Date.now().valueOf();

    const yearWeekKey = getYearWeekString(timestamp);

    await db
      .collection("projects")
      .doc(slashCommand.channel_name)
      .set(
        { [yearWeekKey]: { [slashCommand.user_id]: score } },
        { merge: true }
      );
  });
