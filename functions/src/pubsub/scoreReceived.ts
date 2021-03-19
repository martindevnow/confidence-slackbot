import * as functions from "firebase-functions";
import admin from "firebase-admin";

import { getYearWeekString, logIt } from "../utils";
import { ENPS_PUBSUB_TOPICS, SlashCommand } from "../types";

const db = admin.firestore();

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
