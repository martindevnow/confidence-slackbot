import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { postResults } from "../slack/postResults";
import { WebClient } from "@slack/web-api";
import { Installation } from "@slack/oauth";

const db = admin.firestore();

/**
 * Function to run weekly and update channels
 * on what the eNPS score from the previous week was
 */
export const postBeginningOfWeekScoreUpdate = functions.pubsub
  .schedule("every 5 minutes")
  // .schedule("5 10 * * 2") // 10:05 AM on Tuesdays
  .timeZone("America/New_York")
  .onRun(async (context) => {
    const installations = await db.collection("teams").get();
    installations.forEach(async (querySnapshot) => {
      const installation = querySnapshot.data() as Installation;
      if (installation.bot?.token && installation.team?.id) {
        const client = new WebClient(installation.bot.token);
        const team = { id: installation.team.id };
        await postResults({ db, team, client });
      }
    });
  });
