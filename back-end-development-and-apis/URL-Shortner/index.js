require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const urlParser = require('url');
const ShortUrl = require('./Models/ShortUrl');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


mongoose.connect(process.env.MONGO_URL)
  .then((error, data) => {
    console.log('DATABASE CONNECTED');
  })
  .catch((error) => {
    console.log(error);
    console.log('DATABASE ERROR');
  })

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async function (req, res) {

  const dnsLookup = dns.lookup(urlParser.parse(req.body.url).hostname, function (err, data) {

    if (err) {
      return res.json({ error: 'invalid url' });
    }

    if (urlParser.parse(req.body.url).hostname == null) {
      return res.json({ error: 'invalid url' });
    }

  });

  try {

    const counts = await ShortUrl.countDocuments({});

    const shortUrlData = await ShortUrl.create({
      original_url: req.body.url,
      short_url_number: counts
    });

    console.log(shortUrlData);

    return res.json({
      original_url: shortUrlData.original_url,
      short_url: shortUrlData.short_url_number
    });

  } catch (error) {
    console.log(error);
  }

});

app.get('/api/shorturl/:number', async function (req, res) {

  try {

    const shortUrlData = await ShortUrl.findOne({
      short_url_number: req.params.number
    });

    console.log(shortUrlData);

    if (!shortUrlData) {
      return res.json({ "error": "No short URL found for the given input" });
    }

    return res.redirect(shortUrlData.original_url);

  } catch (error) {
    console.log(error);
  }

});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
