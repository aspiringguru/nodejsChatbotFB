//refer example below for starting point
//https://codeburst.io/build-a-simple-weather-app-with-node-js-in-just-16-lines-of-code-32261690901d

const request = require('request');
const fs = require('fs');
const contents = fs.readFileSync('automationservices_ga_passwords.json');
var jsonContent = JSON.parse(contents);
console.log("city:", jsonContent.city);
console.log("weatherapiKey:", jsonContent.weatherapiKey);

let url = `http://api.openweathermap.org/data/2.5/weather?q=${jsonContent.city}&units=metric&appid=${jsonContent.weatherapiKey}`

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    console.log('body:', body);
    let weather = JSON.parse(body)
    //let temp = Math.round(weather.main.temp - 273.15)
    let temp = weather.main.temp
    let temp_min = weather.main.temp_min
    let temp_max = weather.main.temp_max
    let message =  `${weather.weather[0].description} today. It's ${temp} degrees Celcius and humidity `
        message += `${weather.main.humidity}% in ${weather.name} with expected `
        message += `maximum temp of ${temp_min} minimum ${temp_max} degrees. `
        message += `Cloud cover is ${weather.clouds.all} %. `
        //message += `Wind is ${weather.wind.speed} from ${weather.wind.deg}`
        //message += `  lon ${weather.coord.lon} lat ${weather.coord.lat}`
    console.log(message);
    //console.log(weather.weather[0].main, weather.weather[0].description)
  }
});
