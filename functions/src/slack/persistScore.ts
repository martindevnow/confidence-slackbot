import { getYearWeekString } from "../utils";

interface Props {
  db: FirebaseFirestore.Firestore;
  text: string;
  user: { id: string };
  channel: { name: string };
  team: { id: string };
}

export const persistScore = async ({
  db,
  text,
  user,
  channel,
  team,
}: Props) => {
  const score = +text;

  if (isNaN(score)) {
    console.error("Score was NaN", "Text Received: ", text);
    return;
  }
  const timestamp = Date.now().valueOf();
  const yearWeekKey = getYearWeekString(timestamp);

  return await db
    .collection("team-activity")
    .doc(team.id)
    .collection("projects")
    .doc(channel.name)
    .set({ [yearWeekKey]: { [user.id]: score } }, { merge: true });
};
