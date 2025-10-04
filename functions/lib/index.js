"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
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
    var _a, _b;
    try {
        const payload = req.body;
        const snapshot = await db.collection("myData").get();
        const results = snapshot.docs.map((d) => d.data());
        var currentActivities = results.filter((r) => r.id === payload.userId);
        var activities = payload.activities;
        activities = activities.concat((_b = (_a = currentActivities === null || currentActivities === void 0 ? void 0 : currentActivities[0]) === null || _a === void 0 ? void 0 : _a.activities) !== null && _b !== void 0 ? _b : []);
        activities = activities.filter((obj, index, arr) => index ===
            arr.findIndex((o) => o.date === obj.date && o.distance === obj.distance));
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error fetching data");
    }
});
// Export function
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map