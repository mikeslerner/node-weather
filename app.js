require('dotenv').config();
const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    address: {
      alias: 'a',
      describe: 'Address to fetch weather for',
      demand: true,
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

  var encodedAddress = encodeURIComponent(argv.address);
  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GEOCODE}`;
  var formattedAddress = '';

  axios.get(geocodeUrl).then((response) => {
    if(response.data.status === 'OVER_QUERY_LIMIT') {
      throw new Error('Wait a few seconds before trying again (OVER_QUERY_LIMIT)');
    } else if(response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find address');
    } else if(response.data.status === 'REQUEST_DENIED') {
      throw new Error(response.data.error_message);
    }

    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/${process.env.WEATHER}/${lat},${lng}`;
    formattedAddress = response.data.results[0].formatted_address;

    return axios.get(weatherUrl);
  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature} in ${formattedAddress}. It feels like ${apparentTemperature}.`);
  }).catch((e) => {
    if(e.code === 'ERR_TLS_CERT_ALTNAME_INVALID') {
      console.log('Cannot connect to the servers.');
    } else {
      console.log(e.message);
    }
  });
