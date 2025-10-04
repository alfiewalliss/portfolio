import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

if (process.env.FUNCTIONS_EMULATOR) {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

if (process.env.FUNCTIONS_EMULATOR) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const allowedIds = [
  "52574369",
  "46048265",
  "116093133",
  "52568829",
  "55710489",
  "83786875",
  "135110733",
  "80395176",
];

// POST endpoint - save JSON with extra logic
app.post("/data", async (req, res) => {
  try {
    const payload: { userId: string; activities: any[] } = req.body;

    const snapshot = await db.collection("myData").get();
    const results = snapshot.docs.map((d) => d.data());

    var currentActivities = results.filter((r) => r.id === payload.userId);

    var activities = payload.activities;

    activities = activities.concat(currentActivities?.[0]?.activities ?? []);

    activities = activities.filter(
      (obj, index, arr) =>
        index ===
        arr.findIndex((o) => o.date === obj.date && o.distance === obj.distance)
    );
    const cutoff = new Date("2025-10-01T00:00:00");
    activities = activities.filter((r) => new Date(r.date) >= cutoff);

    console.log("Flattened Activities: ", activities);

    if (allowedIds.includes(payload.userId)) {
      await db.collection("myData").doc(payload.userId).set({
        id: payload.userId,
        activities: activities,
        lastUpdated: new Date().toISOString(),
      });

      res.status(201).json(payload);
      console.log("Request received");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving data");
  }
});

// GET endpoint - return all stored data
app.get("/data", async (req, res) => {
  try {
    const snapshot = await db.collection("myData").get();
    const results = snapshot.docs.map((d) => d.data());
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// Export function
export const api = functions.https.onRequest(app);
