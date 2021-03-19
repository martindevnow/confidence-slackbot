// import { WebClient } from "@slack/web-api";
// import * as functions from "firebase-functions";
// import {
//   ENPS_PUBSUB_TOPICS,
//   PostResultsMessage,
//   SimpleChannel,
// } from "../types";
// import { getMemberChannels, getYearWeekString, logIt } from "../utils";
// import admin from "firebase-admin";

// const bot = new WebClient(functions.config().slack.token);
// const db = admin.firestore();

// export const postResultsPubSub = functions.pubsub
//   .topic(ENPS_PUBSUB_TOPICS.PostResults)
//   .onPublish(async (message, context) => {
//     const body = message.json as PostResultsMessage;

//     logIt(ENPS_PUBSUB_TOPICS.PostResults, body);

//     const lastWeek = new Date(Date.now());
//     lastWeek.setDate(lastWeek.getDate() - 5);

//     const lastWeekKey = getYearWeekString(lastWeek.valueOf());
//     logIt("Last Week Key", lastWeekKey);

//     const channels = !body.channel
//       ? await getMemberChannels(bot)
//       : [body.channel];

//     await Promise.all(
//       channels.map(async (simpleChannel: SimpleChannel) => {
//         const documentSnapshot = await db
//           .collection("projects")
//           .doc(simpleChannel.name)
//           .get();

//         const values = documentSnapshot.data();

//         const weeksData = values?.[lastWeekKey];
//         logIt("weeksData", weeksData);

//         return bot.chat.postMessage({
//           channel: simpleChannel.id,
//           text: "Last week's results are in! Calculating...",
//         });
//       })
//     );
//   });
