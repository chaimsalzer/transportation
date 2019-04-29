const requestBody = {
  "S:Envelope": {
    _attributes: {
      "xmlns:S": "http://schemas.xmlsoap.org/soap/envelope/"
    },
    "S:Body": {
      "siriWS:GetStopMonitoringService": {
        _attributes: {
          "xmlns:siriWS": "http://new.webservice.namespace",
          xmlns: "",
          "xmlns:ns4": "http://www.ifopt.org.uk/ifopt",
          "xmlns:ns3": "http://www.ifopt.org.uk/acsb",
          "xmlns:siri": "http://www.siri.org.uk/siri"
        },
        Request: {
          "siri:RequestTimestamp": "2019-04-28T20:55:59.545Z",
          "siri:RequestorRef": "CZ310987",
          "siri:MessageIdentifier": "0",
          "siri:StopMonitoringRequest": {
            _attributes: {
              version: "2.7"
            },
            "siri:RequestTimestamp": "2019-04-28T20:55:59.545Z",
            "siri:MessageIdentifier": "0",
            "siri:PreviewInterval": "PT30M",
            "siri:StartTime": "2019-04-28T20:55:59.545Z",
            "siri:MonitoringRef": "21258",
            "siri:MaximumStopVisits": "100"
          }
        }
      }
    }
  }
};
module.exports = {
  requestBody,
  url: "http://siri.motrealtime.co.il:8081/Siri/SiriServices",
  headers: { "Content-Type": "text/xml" }
};
