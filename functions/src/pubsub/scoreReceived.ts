import * as functions from "firebase-functions";
import admin from "firebase-admin";

import { getYearWeekString, logIt } from "../utils";
import { SlashCommand } from "../types";
import { ENPS_PUBSUB_TOPICS } from "../constants";

const db = admin.firestore();

/**
 * Handle the receipt of Scores via PubSub
 */
export const scoreReceivedPubsub = functions.pubsub
  .topic(ENPS_PUBSUB_TOPICS.ScoreReceived)
  .onPublish(async (message, context) => {
    logIt(ENPS_PUBSUB_TOPICS.ScoreReceived);

    const slashCommand = message.json as SlashCommand;
    const score = +slashCommand.text;

    if (isNaN(score)) {
      console.error("Score was NaN", "Text Received: ", slashCommand.text);
      return;
    }
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
