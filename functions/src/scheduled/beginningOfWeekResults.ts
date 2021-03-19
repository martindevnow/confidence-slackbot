// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

import * as functions from "firebase-functions";
import { PubSub } from "@google-cloud/pubsub";

import { ENPS_PUBSUB_TOPICS } from "../constants";

const pubSubClient = new PubSub();

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
