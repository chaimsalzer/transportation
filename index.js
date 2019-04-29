const constants = require("./constants");
const axios = require("axios");
var convert = require("xml-js");

const { requestBody, url, headers } = constants;

const currentDateTime = new Date().toISOString();

var requestOptions = { compact: true, ignoreComment: true, spaces: 4 };

console.log(requestBody);

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
  return times;
};

transRequestAsync();
