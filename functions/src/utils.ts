import * as functions from "firebase-functions";
import { WebClient } from "@slack/web-api";
import { SimpleChannel, SlackChannel } from "./types";

export const logIt = (...args: any): void =>
  console.log(...args.map((arg: any) => JSON.stringify(arg)));

interface Props {
  client: WebClient;
  bot: { id: string };
}
/**
 * Check which channels the bot is a member of
 *
 * @param client
 * @returns
 */
export const getMemberChannels = async ({ client, bot }: Props) => {
  try {
    const rooms = (
      await client.users.conversations({
        user: bot.id,
        types: "public_channel,private_channel",
        exclude_archived: true,
      })
    ).channels as Array<SlackChannel>;

    const channels = rooms.map(
      ({ id, name }): SimpleChannel => ({
        name,
        id,
      })
    );

    functions.logger.log(`This bot belongs to ${channels.length} channel(s)`);

    return channels;
  } catch (error) {
    functions.logger.error("API Error with Slack Bot");
    functions.logger.error(error);
    return [];
  }
};

// This might not be super useful anymore...
// now that we can query specifically the rooms the bot is in
const getAllRooms = async (
  client: WebClient,
  cursor?: string
): Promise<Array<SlackChannel>> => {
  const roomsReq = await client.conversations.list({
    types: "public_channel,private_channel", // Can't seem to get this scope from Slack, even though it is selected in the UI
    exclude_archived: true,
    ...(cursor ? { cursor } : {}),
  });

  if (!roomsReq.response_metadata?.next_cursor) {
    return roomsReq.channels as Array<SlackChannel>;
  }

  return [
    ...((roomsReq.channels as Array<SlackChannel>) || []),
    ...(await getAllRooms(client, roomsReq.response_metadata.next_cursor)),
  ];
};

/**
 * From: https://www.epochconverter.com/weeknumbers
 * Validated Against: https://www.epochconverter.com/weeks/2021
 *
 * @param timestamp
 * @returns
 */
export const getWeekOfYear = (timestamp: number) => {
  const target = new Date(timestamp);
  const dayNr = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

/**
 * Modeled off the above
 *
 * @param timestamp
 * @returns
 */
export const getYearOfWeek = (timestamp: number) => {
  const target = new Date(timestamp);
  const dayNr = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursdayYear = target.getFullYear();
  return firstThursdayYear;
};

/**
 * Use for bucketing and averaging votes
 *
 * @param timestamp
 * @returns
 */
export const getYearWeekString = (timestamp: number) => {
  const week = getWeekOfYear(timestamp);
  const year = getYearOfWeek(timestamp);

  return `${year}-${week.toString().padStart(2, "0")}`;
};
