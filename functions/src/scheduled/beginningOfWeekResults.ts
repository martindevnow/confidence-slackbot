import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { WebClient } from "@slack/web-api";
import { Installation } from "@slack/oauth";

import { postResults } from "../slack/postResults";

const db = admin.firestore();

/**
 * Function to run weekly and update channels
 * on what the Confidence Rating from the previous week was
 */
export const postBeginningOfWeekScoreUpdate = functions.pubsub
  // .schedule("every 5 minutes")
  .schedule("30 10 * * 1") // 10:30 AM on Monday (1st day of the week)
  .timeZone("America/New_York")
  .onRun(async (context) => {
    const installations = await db.collection("teams").get();
    installations.forEach(async (querySnapshot) => {
      const installation = querySnapshot.data() as Installation;
      if (installation.bot?.token && installation.team?.id) {
        const name = installation.team.name;

        functions.logger.log(`Posting results to workspace (name: ${name})`);
        const bot = { id: installation.bot.userId };
        const client = new WebClient(installation.bot.token);
        const team = { id: installation.team.id };
        functions.logger.log({ bot, team });

        await postResults({ db, team, client, bot });
      }
    });
  });
