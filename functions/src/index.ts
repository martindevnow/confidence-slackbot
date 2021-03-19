// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

import * as functions from "firebase-functions";
import { PubSub } from "@google-cloud/pubsub";
import admin from "firebase-admin";

import { logIt } from "./utils";
import { ENPS_PUBSUB_TOPICS, SlashCommand } from "./types";
// import { legitSlackRequest } from "./verify";

admin.initializeApp();

const pubSubClient = new PubSub();
const validScoresRegex = /^((1[0-9])|([1-9]))$/;

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
  logIt("slackSlashCommand Received ...");

  const helpText = `**eNPS**
  eNPS is an *Employee Net Promoter Score*. It asks one simple question.
  
  > On a scale from 1-10, how likely are you to recommend Thrillworks (our product) to your family and friends? 
  
  In your project slack channel, this bot can be added. This will allow your team to submit their scores on a regular basis.

  Use the simple slack command: \`/enps #\` where \`#\` is a number from 1-10.`;

  // Commands
  // /enps help
  // /enps reminder
  // /enps results
  // /enps [1-10]

  // Verify Signature
  // const valid = legitSlackRequest(req);
  // if (!valid) {
  //   console.error("Failed Validation Check on Secret");
  //   res.sendStatus(403);
  //   return;
  // }

  const command = req.body as SlashCommand;
  const commandArgument = command.text;
  logIt("Command Argument", commandArgument);

  if (commandArgument === "reminder") {
    const data = JSON.stringify({
      channel: { id: command.channel_id },
    });
    const dataBuffer = Buffer.from(data);
    logIt("Dispatching PostReminder");
    await pubSubClient
      .topic(ENPS_PUBSUB_TOPICS.PostReminder)
      .publish(dataBuffer);
    res.status(200).send("A reminder will be posted to the channel.");
    return;
  }

  if (commandArgument === "results") {
    const data = JSON.stringify({
      channel: { id: command.channel_id, name: command.channel_name },
    });
    const dataBuffer = Buffer.from(data);
    logIt("Dispatching PostResults");
    await pubSubClient
      .topic(ENPS_PUBSUB_TOPICS.PostResults)
      .publish(dataBuffer);
    res.status(200).send("Last week's results will be posted to the channel.");
    return;
  }

  if (validScoresRegex.test(commandArgument)) {
    const dataStr = JSON.stringify(command);
    const dataBuffer = Buffer.from(dataStr);

    logIt("Dispatching ScoreReceived");
    await pubSubClient
      .topic(ENPS_PUBSUB_TOPICS.ScoreReceived)
      .publish(dataBuffer);
    res.status(200).send("Thank you for submitting!");
    return;
  }

  res.status(200).send(helpText);
  return;
});

/**
 * Function to run weekly and remind channels
 * (where the app is installed)
 * to submit their eNPS scores for the week
 *
 * CRON :: `5 14 * * 5` = at 14:05 on Fridays
 */
export const postEndOfWeekReminderMessage = functions.pubsub
  .schedule("5 14 * * 5") // 2:05 PM on Fridays
  .timeZone("America/New_York")
  .onRun(async (context) => {
    // Don't set channel to post to all channels
    const dataStr = JSON.stringify({});
    const dataBuffer = Buffer.from(dataStr);

    await pubSubClient
      .topic(ENPS_PUBSUB_TOPICS.PostReminder)
      .publish(dataBuffer);
  });

/**
 * Function to run weekly and update channels
 * on what the eNPS score from the previous week was
 */
export const postBeginningOfWeekScoreUpdate = functions.pubsub
  .schedule("5 10 * * 2") // 10:05 AM on Tuesdays
  .timeZone("America/New_York")
  .onRun(async (context) => {
    // Don't set channel to post to all channels
    const dataStr = JSON.stringify({});
    const dataBuffer = Buffer.from(dataStr);
    await pubSubClient
      .topic(ENPS_PUBSUB_TOPICS.PostResults)
      .publish(dataBuffer);
  });

export * from "./pubsub/reminderMessage";
export * from "./pubsub/resultsMessage";
export * from "./pubsub/scoreReceived";
