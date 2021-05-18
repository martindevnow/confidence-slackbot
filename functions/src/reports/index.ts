import * as functions from "firebase-functions";
import admin from "firebase-admin";

// const CONFIG = functions.config();

const db = admin.firestore();

// interface ProjectData {
//   [key: string]: {
//     [userId: string]: number;
//   };
// }

export const reports = functions.https.onRequest(async (req, res) => {
  const resultsQuerySnapshot = await db
    .collection("team-activity/T04EEL3LC/projects")
    .get();

  const projects = resultsQuerySnapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    data: docSnapshot.data(), // { [key: '2021-##']: {} }
  }));

  console.log(projects);
  res.send({ projects });
});
