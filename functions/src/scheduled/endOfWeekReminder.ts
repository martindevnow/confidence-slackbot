import * as functions from "firebase-functions";
import { PubSub } from "@google-cloud/pubsub";
import { ENPS_PUBSUB_TOPICS } from "../constants";

const pubSubClient = new PubSub();

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
