const functions = require("firebase-functions");
const constants = require("./constants");
const axios = require("axios");
var convert = require("xml-js");
const admin = require("firebase-admin");
const cors = require('cors')({
  origin: true,
});

admin.initializeApp();

const { requestBody, url, headers } = constants;
const requestOptions = { compact: true, ignoreComment: true, spaces: 4 };
const request =
  requestBody["S:Envelope"]["S:Body"]["siriWS:GetStopMonitoringService"][
    "Request"
  ];

const nowIso = new Date().toISOString();

request["siri:RequestTimestamp"] = nowIso;
request["siri:StopMonitoringRequest"]["siri:RequestTimestamp"] = nowIso;
request["siri:StopMonitoringRequest"]["siri:StartTime"] = nowIso;
request["siri:StopMonitoringRequest"]["siri:MonitoringRef"] = 21258;
request["siri:StopMonitoringRequest"]["siri:PreviewInterval"] = "PT12H";

console.log(request);

const data = convert.js2xml(requestBody, requestOptions);

const transRequestAsync = async () => {
  const responseXml = await axios({ method: "post", url, headers, data });
  const responseObject = convert.xml2js(responseXml.data, {
    compact: true,
    trim: true,
    nativeType: true,
    ignoreDeclaration: true,
    ignoreAttributes: true,
    ignoreCdata: true
  });
  const MonitoredStopVisits =
    responseObject["S:Envelope"]["S:Body"][
      "ns7:GetStopMonitoringServiceResponse"
    ]["Answer"]["ns3:StopMonitoringDelivery"]["ns3:MonitoredStopVisit"];

  const stationVisits = {};

  MonitoredStopVisits.forEach(visit => {
    const Journey = visit["ns3:MonitoredVehicleJourney"];
    const PublishedLineName = Journey["ns3:PublishedLineName"]._text;
    const ExpectedArrivalTime =
      Journey["ns3:MonitoredCall"]["ns3:ExpectedArrivalTime"]._text;
    const VehicleLocation = Journey["ns3:VehicleLocation"];

    if (!stationVisits[PublishedLineName]) {
      stationVisits[PublishedLineName] = { ExpectedArrivalTimes: [] };
    }
    stationVisits[PublishedLineName].ExpectedArrivalTimes.push({
      ExpectedArrivalTime,
      VehicleLocation: {
        Latitude: VehicleLocation
          ? VehicleLocation["ns3:Latitude"]._text
          : null,
        Longitude: VehicleLocation
          ? VehicleLocation["ns3:Longitude"]._text
          : null
      }
    });
  });
  console.log(stationVisits);
};

// transRequestAsync();

// export const scheduledFunction = functions.pubsub
//   .schedule("every 1 minutes")
//   .onRun(context => {
//     console.log("This will be run every 5 minutes!");
//   });

//   export scheduledFunction = functions.pubsub.schedule(‘every 5 minutes’).onRun((context) => {
//     console.log(‘This will be run every 5 minutes!’);
//   });



exports.date = functions.https.onRequest((req, res) => {
  // [END trigger]
  // [START sendError]
  // Forbidding PUT requests.
  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }
  // [END sendError]

  // [START usingMiddleware]
  // Enable CORS using the `cors` express middleware.
  return cors(req, res, () => {
    // [END usingMiddleware]
    // Reading date format from URL query parameter.
    // [START readQueryParam]
    let format = req.query.format;
    // [END readQueryParam]
    // Reading date format from request body query parameter
    if (!format) {
      // [START readBodyParam]
      format = req.body.format;
      // [END readBodyParam]
    }
    // [START sendResponse]
    const formattedDate = 'fatter';
    console.log('Sending Formatted date:', formattedDate);
    res.status(200).send(formattedDate);
    // [END sendResponse]
  });
});