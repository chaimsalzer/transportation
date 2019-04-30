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
console.log(request);

const data = convert.js2xml(requestBody, requestOptions);

const transRequestAsync = async () => {
  const res = await axios({ method: "post", url, headers, data });
  const times = convert.xml2js(res.data, {
    compact: true,
    trim: true,
    nativeType: true,
    ignoreDeclaration: true,
    ignoreAttributes: true,
    ignoreCdata: true
  });
  console.log(times);
};

transRequestAsync();

