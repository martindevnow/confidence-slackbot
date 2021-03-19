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
    types: "public_channel",
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

// const getYearAndWeekOfYearFromTimestamp = (timestamp: number) => {
//   // Copy date so don't modify original
//   const d = new Date(timestamp);
//   // Set to nearest Thursday: current date + 4 - current day number
//   // Make Sunday's day number 7
//   d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
//   // Get first day of year
//   const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
//   // Calculate full weeks to nearest Thursday
//   const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
//   // Return array of year and week number
//   return [d.getUTCFullYear(), weekNo];
// };
