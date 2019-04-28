const https = require("https");
var xml2js = require("xml2js");

var xml = "<root>Hello xml2js!</root>";
var obj = { name: "Super", Surname: "Man", age: 23 };

xml2js.parseString(xml, function (err, result) {
    // console.dir(result);
});

var builder = new xml2js.Builder();

var xml = builder.buildObject(obj);

console.log(xml);

// https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
//   let data = '';

//   // A chunk of data has been recieved.
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });

//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     console.log(JSON.parse(data).explanation);
//   });

// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });
