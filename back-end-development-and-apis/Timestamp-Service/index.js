// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const moment = require('moment');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
const formatDate = function (date) {

  // Fri, 25 Dec 2015 00:00:00 GMT
  // Fri, 25 Dec 2015 05:30:00 GMT
  const weekday = date.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC', });
  const day = date.toLocaleString('en-US', { day: '2-digit', timeZone: 'UTC', });
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC', });
  const year = date.toLocaleString('en-US', { year: 'numeric', timeZone: 'UTC', });

  var hour = date.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: 'UTC', });

  if (hour == 24) {
    hour = "00";
  }

  var minute = date.toLocaleString('en-US', { minute: '2-digit', timeZone: 'UTC', });

  if (minute == 0) {
    minute = "00";
  }

  var second = date.toLocaleString('en-US', { second: 'numeric', minimumIntegerDigits: 2, timeZone: 'UTC' });

  if (second == 0) {
    second = "00";
  }

  return `${weekday}, ${day} ${month} ${year} ${hour}:${minute}:${second} GMT`;
}

app.get("/api/:date?", function (req, res) {

  var date = req.params.date;

  if (!date) {

    const nowDate = new Date();
    const nowUnix = nowDate.getTime();

    let nowDateTimestamp = formatDate(nowDate);
    return res.json({ "unix": Number(nowUnix), "utc": nowDateTimestamp })

  }

  console.log(typeof date + "Yes");

  if (typeof date == 'string' && !(date instanceof Date) && (!isNaN(date))) {
    date = Number(date);
  }

  const parseDate = new Date(date);

  if (parseDate == "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  const isDate = parseDate instanceof Date && (!isNaN(parseDate))

  if (isDate) {
    var convertedUnixTimestamp = parseDate.getTime();
  } else {
    var convertedUnixTimestamp = date;
  }

  if (isDate) {
    var convertedDateTimestamp = formatDate(parseDate);
  } else {
    var convertedDateTimestamp = date;
  }

  return res.json({ "unix": Number(convertedUnixTimestamp), "utc": convertedDateTimestamp})

});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
