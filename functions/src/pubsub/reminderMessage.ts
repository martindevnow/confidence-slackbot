import { WebClient } from "@slack/web-api";
import * as functions from "firebase-functions";
import {
  ENPS_PUBSUB_TOPICS,
  PostReminderMessage,
  SimpleChannel,
} from "../types";
import { getMemberChannels, logIt } from "../utils";

const bot = new WebClient(functions.config().slack.token);

export const postReminderPubSub = functions.pubsub
  .topic(ENPS_PUBSUB_TOPICS.PostReminder)
  .onPublish(async (message, context) => {
    const body = message.json as PostReminderMessage;

    logIt(ENPS_PUBSUB_TOPICS.PostReminder, body);

    const channels = !body.channel?.id
      ? await getMemberChannels(bot)
      : [{ id: body.channel.id, name: "" }];

    await Promise.all(
      channels.map(async (simpleChannel: SimpleChannel) => {
        return bot.chat.postMessage({
          channel: simpleChannel.id,
          text:
            "It's that time! Please submit your eNPS score! Simply type `/enps # ` " +
            "(where # is from 1 to 10)." +
            "\nYour submission will be secret!",
        });
      })
    );
  });
