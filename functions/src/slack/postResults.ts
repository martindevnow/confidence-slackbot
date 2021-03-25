import { WebClient } from "@slack/web-api";

import { SimpleChannel, WeekData } from "../types";
import { getMemberChannels, getYearWeekString, logIt } from "../utils";

interface Props {
  db: FirebaseFirestore.Firestore;
  channel?: { id: string; name: string };
  team: { id: string };
  client: WebClient;
}

export const postResults = async ({ db, channel, team, client }: Props) => {
  const lastWeek = new Date(Date.now());
  lastWeek.setDate(lastWeek.getDate() - 5);

  const lastWeekKey = getYearWeekString(lastWeek.valueOf());
  logIt("Last Week Key", lastWeekKey);

  const channels: SimpleChannel[] = !channel
    ? await getMemberChannels(client)
    : [channel];

  // if channels.length === 1,
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
          text: `Unfortunately, no eNPS scores were recorded last week. Don't forget to submit your scores this week!`,
        });
      }

      const votes = Object.values(weeksData);
      const average = votes.reduce((acc, curr) => acc + curr, 0) / votes.length;
      const roundAverage = Math.round(average * 10) / 10;

      // logIt("weeksData", weeksData);
      // logIt("numVotes", votes.length);
      // logIt("average", average);
      // logIt("roundAverage", roundAverage);

      return client.chat.postMessage({
        channel: simpleChannel.id,
        text: `Last week, we received ${votes.length} score${
          votes.length > 1 ? "s" : ""
        }, with an average score of ${roundAverage}`,
      });
    })
  );
};
