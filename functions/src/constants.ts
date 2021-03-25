export const ENPS_PUBSUB_TOPICS = {
  PostReminder: "ENPS-PostReminder",
  PostResults: "ENPS-PostResults",
  ScoreReceived: "ENPS-ScoreReceived",
} as const;

export const SLACK_STATE_SECRET = "eNpsStateSecretThing";

export const VALID_SCORES_REGEX = /^((1[0-9])|([1-9]))$/;

export const HELP_TEXT = `**eNPS**
  eNPS is an *Employee Net Promoter Score*. It asks one simple question.
  
  > On a scale from 1-10, how likely are you to recommend Thrillworks (our product) to your family and friends? 
  
  In your project slack channel, this bot can be added. This will allow your team to submit their scores on a regular basis.

  Use the simple slack command: \`/enps #\` where \`#\` is a number from 1-10.`;
