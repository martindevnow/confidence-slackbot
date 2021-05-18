import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { createHmac } from "crypto";

const db = admin.firestore();

const hashFactory = (secret: string) => (userId: string) =>
  createHmac("sha256", secret).update(userId).digest("hex");

interface ProjectData {
  [yearWeek: string]: {
    [userId: string]: number;
  };
}

const flat = <T>(acc: Array<T>, curr: Array<T>) => acc.concat(curr);

// Uses modified version of the auth example found here:
// https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js

export const reports = functions.https.onRequest(async (req, res) => {
  functions.logger.log("Check if request is authorized with Firebase ID token");

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    functions.logger.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    res.status(403).send("Unauthorized");
    return;
  }

  functions.logger.log('Found "Authorization" header');
  // Read the ID Token from the Authorization header.
  const apiToken = req.headers.authorization.split("Bearer ")[1];

  const companyId = req.query["company"];

  const companyData = (await db.doc(`teams/${companyId}`).get()).data();
  if (!companyData?.reportsApiKey || companyData.reportsApiKey !== apiToken) {
    // Not allowed!
    res.status(403).send("Unauthorized");
    return;
  }

  const hash = hashFactory(companyId as string);

  const resultsQuerySnapshot = await db
    .collection(`team-activity/${companyId}/projects`)
    .get();

  const projects = resultsQuerySnapshot.docs
    .map((docSnapshot) => ({
      id: docSnapshot.id,
      data: docSnapshot.data() as ProjectData, // { [key: '2021-##']: {} }
    }))
    .map((project) =>
      Object.entries(project.data)
        .map(([yearWeek, userVotes]) => {
          const [year, week] = yearWeek.split("-");
          return Object.entries(userVotes).map(([userId, rating]) => ({
            projectId: project.id,
            year,
            week,
            userId: hash(userId),
            rating,
          }));
        })
        .reduce(flat, [])
    )
    .reduce(flat, []);

  res.status(200).send({ data: projects });
});
