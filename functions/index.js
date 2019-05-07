const functions = require("firebase-functions");
const trans = require("./transportationRequest");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest(async (_, res) => {
  // const transportationData = trans.getStationData();

  const docRef = await db.collection("stations").doc("21258");

  const stationSet = docRef.set({
    lines: {
      400: { x: 1, y: 2 }
    }
  });
  res.redirect(303, stationSet.toString());

  // res.redirect(303, stationSet.toString());
});

// exports.accountcleanup = functions.pubsub
//   .schedule("every 1 minute")
//   .onRun(async context => {
//     console.log("User cleanup finished");
//   });
