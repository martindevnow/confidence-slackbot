import { WebClient } from "@slack/web-api";
import { SimpleChannel, SlackChannel } from "./types";

export const logIt = (...args: any): void =>
  console.log(...args.map((arg: any) => JSON.stringify(arg)));

/**
 * Check which channels the bot is a member of
 *
 * @param slackBot
 * @returns
 */
export const getMemberChannels = async (slackBot: WebClient) => {
  const rooms = await slackBot.conversations.list({
    types: "public_channel,private_channel",
    exclude_archived: true,
  });

  const channels = (rooms.channels as SlackChannel[])
    .filter((channel) => channel.is_member)
    .map(
      ({ id, name }): SimpleChannel => ({
        name,
        id,
      })
    );

  return channels;
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
