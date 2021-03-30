import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();

/**
 * Default function to validate with Slack
 */
export const validateChallenge = functions.https.onRequest(async (req, res) => {
  const { challenge } = req.body;
  res.send({ challenge });
});

/**
 * TODO: These scheduled functions need to leverage Bolt (maybe?)
 * to ensure we have Auth to post to these channels "unprovoked"
 */
// export * from "./scheduled/beginningOfWeekResults";
// export * from "./scheduled/endOfWeekReminder";

/**
 * This now handles the logic for the slack slash commands
 */
export * from "./slack/index";
export * from "./scheduled/beginningOfWeekResults";
