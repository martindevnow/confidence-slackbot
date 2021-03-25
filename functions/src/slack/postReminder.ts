import { WebClient } from "@slack/web-api";
import { SimpleChannel } from "../types";
import { getMemberChannels } from "../utils";

interface Props {
  client: WebClient;
  channel: { id: string };
}

export const postReminder = async ({ client, channel }: Props) => {
  const channels = !channel?.id
    ? await getMemberChannels(client)
    : [{ id: channel.id, name: "" }];

  await Promise.all(
    channels.map(async (simpleChannel: SimpleChannel) => {
      return client.chat.postMessage({
        channel: simpleChannel.id,
        text:
          "It's that time! Please submit your eNPS score! Simply type `/enps # ` " +
          "(where # is from 1 to 10)." +
          "\nYour submission will be secret!",
      });
    })
  );
};
