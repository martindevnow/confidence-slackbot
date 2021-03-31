import { WebClient } from "@slack/web-api";
import { SimpleChannel } from "../types";
import { getMemberChannels } from "../utils";

interface Props {
  client: WebClient;
  channel?: { id: string };
  team: { id: string };
  bot: { id: string };
}

const REMINDER = `It’s that time! Please submit your Team Confidence Rating! 

Simply type \`/conf #\` (on a scale from 1 to 9) 

*Your submission will not be posted by name in the channel!*`;

export const postReminder = async ({ client, channel, team, bot }: Props) => {
  const channels = !channel?.id
    ? await getMemberChannels({ client, team, bot })
    : [{ id: channel.id, name: "" }];

  await Promise.all(
    channels.map(async (simpleChannel: SimpleChannel) => {
      return client.chat.postMessage({
        channel: simpleChannel.id,
        text: REMINDER,
      });
    })
  );
};
