import * as functions from "firebase-functions";
import * as crypto from "crypto";
import tsscmp from "tsscmp";

export const legitSlackRequest = (req: functions.https.Request) => {
  // Your signing secret
  const slackSigningSecret = functions.config().slack.signing_secret;

  // Grab the signature and timestamp from the headers
  const requestSignature = req.headers["x-slack-signature"] as string;
  const requestTimestamp = req.headers["x-slack-request-timestamp"];

  // Create the HMAC
  const hmac = crypto.createHmac("sha256", slackSigningSecret);

  // Update it with the Slack Request
  const [version, hash] = requestSignature.split("=");
  const base = `${version}:${requestTimestamp}:${JSON.stringify(req.body)}`;
  hmac.update(base);

  // Returns true if it matches
  return tsscmp(hash, hmac.digest("hex"));
};
