import { WebClient } from "@slack/web-api";

import { SimpleChannel, WeekData } from "../types";
import { getMemberChannels, getYearWeekString, logIt } from "../utils";

interface Props {
  db: FirebaseFirestore.Firestore;
  channel?: { id: string; name: string };
  team: { id: string };
  bot: { id: string };
  client: WebClient;
}

const NO_DATA_MESSAGE = `Not everyone’s Team Confidence Ratings were submitted last week. Don’t forget to submit your ratings this week!`;
const MESSAGE = (responses: number, average: number) =>
  `Last week, we received ${responses} rating${
    responses > 1 ? "s" : ""
  }, with an average rating of ${average}`;

export const postResults = async ({
  db,
  channel,
  team,
  client,
  bot,
}: Props) => {
  const lastWeek = new Date(Date.now());
  lastWeek.setDate(lastWeek.getDate() - 5);

  const lastWeekKey = getYearWeekString(lastWeek.valueOf());
  logIt("Last Week Key", lastWeekKey);

  const channels: SimpleChannel[] = !channel
    ? await getMemberChannels({ client, bot })
    : [channel];

  // TODO: if channels.length === 1,
  // then check if client really is in that channel
  // before posting

  await Promise.all(
    channels.map(async (simpleChannel) => {
      const documentSnapshot = await db
        .collection("team-activity")
        .doc(team.id)
        .collection("projects")
        .doc(simpleChannel.name)
        .get();

      const values = documentSnapshot.data();

      const weeksData: WeekData | undefined = values?.[lastWeekKey];
      if (!weeksData) {
        return client.chat.postMessage({
          channel: simpleChannel.id,
          text: NO_DATA_MESSAGE,
        });
      }

      const votes = Object.values(weeksData);
      const average = votes.reduce((acc, curr) => acc + curr, 0) / votes.length;
      const roundAverage = Math.round(average * 10) / 10;

      return client.chat.postMessage({
        channel: simpleChannel.id,
        text: MESSAGE(votes.length, roundAverage),
      });
    })
  );
};
