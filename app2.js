require('dotenv').config();
const yargs = require ('yargs');

const geocode = require('./geocode/geocode');
const weather= require('./weather/weather');

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

geocode.geocodeAddress(argv.address)
  .then((geoResults) => {
    weather.getWeather(geoResults.latitude, geoResults.longitude, (errorMessage, weatherResults) => {
      if(errorMessage) {
        console.log(errorMessage);
      } else {
        console.log(JSON.stringify(geoResults, undefined, 2));
        // console.log(`Weather for location: ${results.address}`);
        // console.log(`It is currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}.`);
      }
    });
  })
  .catch((e) => console.log(e));
