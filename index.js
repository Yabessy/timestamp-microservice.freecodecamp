// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date", function (req, res) {
  function isValidDateFormat(dateString) {
    // Create a regular expression pattern to match against the Y-m-d format
    const pattern = /^\d{4}-\d{2}-\d{2}$/;

    // Test if the string matches the pattern
    return pattern.test(dateString);
  }
  function convertUnixToYMD(unixTimestamp) {
    // Create a new Date object with the Unix timestamp in milliseconds
    const dateObj = new Date(unixTimestamp * 1);
  
    // Get the year, month (0-indexed), and day from the date object
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // add 1 to get the month in the range 1-12
    const day = dateObj.getDate();
  
    // Convert the values to strings and pad with leading zeros if necessary
    const yearStr = year.toString();
    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
  
    // Combine the values into a Y-m-d string
    return `${yearStr}-${monthStr}-${dayStr}`;
  }
  function convertYMDToDate(ymdString) {
    // Create a new Date object with the Y-m-d string
    const dateObj = new Date(ymdString);
  
    // Get the day of the week, day of the month, month (0-indexed), and year from the   date object
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[dateObj.getUTCDay()];
    const dayOfMonth = dateObj.getUTCDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",         "Oct", "Nov", "Dec"];
    const month = months[dateObj.getUTCMonth()];
    const year = dateObj.getUTCFullYear();
  
    // Combine the values into a formatted string
    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year} 00:00:00 GMT`;
  }
  try{
    if(isValidDateFormat(req.params.date)){ 
      const theUnix = new Date(req.params.date).getTime()
      const theUtc = convertYMDToDate(req.params.date)
      res.json({"unix": theUnix,"utc":theUtc})
    } else {
      const theUtc = convertYMDToDate(convertUnixToYMD(req.params.date))
      res.json({"unix": req.params.date, "utc": theUtc })
    }
  } catch(e){
    res.json({"error": e});
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
