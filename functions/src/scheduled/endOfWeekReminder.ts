import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { WebClient } from "@slack/web-api";
import { Installation } from "@slack/oauth";

import { postReminder } from "../slack/postReminder";

const db = admin.firestore();

/**
 * Function to run weekly and remind channels
 * (where the app is installed)
 * to submit their Confidence Rating for the week
 *
 * CRON :: `5 14 * * 5` = at 14:05 on Fridays
 */
export const postEndOfWeekReminderMessage = functions.pubsub
  // .schedule("every 5 minutes")
  .schedule("5 14 * * 5") // 2:05 PM on Fridays
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
        // const team = { id: installation.team.id };
        // functions.logger.log({ bot });

        await postReminder({ client, bot });
      }
    });
  });
