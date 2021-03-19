import { WebClient } from "@slack/web-api";
import * as functions from "firebase-functions";
import {
  ENPS_PUBSUB_TOPICS,
  PostResultsMessage,
  SimpleChannel,
} from "../types";
import { getMemberChannels, getYearWeekString, logIt } from "../utils";
import admin from "firebase-admin";

const bot = new WebClient(functions.config().slack.token);
const db = admin.firestore();

interface WeekData {
  [userId: string]: number;
}

export const postResultsPubSub = functions.pubsub
  .topic(ENPS_PUBSUB_TOPICS.PostResults)
  .onPublish(async (message, context) => {
    logIt(ENPS_PUBSUB_TOPICS.PostResults);
    const body = message.json as PostResultsMessage;

    const lastWeek = new Date(Date.now());
    lastWeek.setDate(lastWeek.getDate() - 5);

    const lastWeekKey = getYearWeekString(lastWeek.valueOf());
    logIt("Last Week Key", lastWeekKey);

    const channels = !body.channel
      ? await getMemberChannels(bot)
      : [body.channel];

    await Promise.all(
      channels.map(async (simpleChannel: SimpleChannel) => {
        const documentSnapshot = await db
          .collection("projects")
          .doc(simpleChannel.name)
          .get();

        const values = documentSnapshot.data();

        const weeksData: WeekData | undefined = values?.[lastWeekKey];
        if (!weeksData) {
          return bot.chat.postMessage({
            channel: simpleChannel.id,
            text: `Unfortunately, no eNPS scores were recorded last week. Don't forget to submit your scores this week!`,
          });
        }

        const votes = Object.values(weeksData);
        const average =
          votes.reduce((acc, curr) => acc + curr, 0) / votes.length;
        logIt("weeksData", weeksData);
        logIt("numVotes", votes.length);
        logIt("average", average);

        return bot.chat.postMessage({
          channel: simpleChannel.id,
          text: `Last week, we received ${votes.length} score${
            votes.length > 1 ? "s" : ""
          }, with an average score of ${average}`,
        });
      })
    );
  });
