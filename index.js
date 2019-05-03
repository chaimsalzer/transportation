const constants = require("./constants");
const axios = require("axios");
var convert = require("xml-js");

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

transRequestAsync();
