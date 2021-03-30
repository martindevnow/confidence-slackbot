export const ENPS_PUBSUB_TOPICS = {
  PostReminder: "ENPS-PostReminder",
  PostResults: "ENPS-PostResults",
  ScoreReceived: "ENPS-ScoreReceived",
} as const;

export const SLACK_STATE_SECRET = "eNpsStateSecretThing";

export const VALID_SCORES_REGEX = /^([1-9])$/;

export const HELP_TEXT = `*Confidence Rating*

What Do We Mean By Confidence? 

On a scale from 1 to 9 - where 1 is low and 9 is high- how confident do you feel about the current state of your project? 

The channel in which you use the \`/conf\` command is the project which you are rating.

- 1 (PROJECT) - I have absolutely no confidence this project is on track for success. 
- 9 (PROJECT) - I have absolute confidence this project is on track for success. `;
