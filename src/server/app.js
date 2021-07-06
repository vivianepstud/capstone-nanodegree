const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const { start } = require('repl');

function createLink(url, params) {
    return url + (url.indexOf('?') > -1 ? '&' : '?') + params.join('&');
};

function validateFields(location, date) {
    if (!/[a-zA-Z\s]+/.test(location) ||
        !/[0-9]{4}-[0-1][0-9]-[0-3][0-9]/.test(date))
        return false
    return true;
}

dotenv.config();
const app = express();
const baseUrls = {
    geoNames: 'http://api.geonames.org/searchJSON',
    weatherBitCurrentWeather: 'https://api.weatherbit.io/v2.0/current',
    weatherBitForecastWeather: 'https://api.weatherbit.io/v2.0/forecast/daily',
    pixabay: 'https://pixabay.com/api/'
};

app.use(bodyParser.json());
app.use(express.static('dist'));
app.use(cors());

app.get('/', function(req, res) {
    res.sendFile(path.resolve('/dist/index.html'));
});

// designates what port the app will listen to for incoming requests

/**
 * @description handles POST endpoint for /sentimentAnalysis route
 * Sends a query to the meaning cloud api to analyse the provided url
 * returns the response as json to the user
 * */
//Weather bit current https://api.weatherbit.io/v2.0/current?key=d8b127e4363f447ab6ca7671be121220&lat=51.50853&lon=0.125742
//Weather bit forecast https://api.weatherbit.io/v2.0/forecast/daily?lat=51.50853&lon=-0.12574&key=d8b127e4363f447ab6ca7671be121220&days=8
app.post('/getLocationInfo', (req, res, next) => {

    const { location, startDate, endDate } = req.body;
    let tripInfo = { location, startDate, endDate };
    if (!validateFields(tripInfo.location, tripInfo.startDate)) {
        return next('One of the fields are invalid');
    }
    const currentDate = moment();
    tripInfo.startDate = moment(tripInfo.startDate, "YYYY-MM-DD");
    tripInfo = {...tripInfo, ... { dayDiff: tripInfo.startDate.diff(currentDate, 'days') } }
    if (tripInfo.dayDiff < 0) {
        return next('Start Date Before Current Time');
    }
    let params = [
        `username=${process.env.GEONAMES_USERNAME}`,
        `q=${encodeURIComponent(tripInfo.location)}`,
        `maxRows=1`,
    ];
    let completeLink = createLink(baseUrls.geoNames, params);

    console.log(`Requesting ${completeLink}`);
    fetch(completeLink, { method: 'POST' })
        .then((res) => {
            if (res.status !== 200) {
                return Promise.reject(` API GEONAMES returned Status ${res.status} - ${res.statusText}`);
            }

            return res.json();
        })
        .then((json) => {

            if (!json.geonames[0]) {
                return Promise.reject(` Could not find location on GEONAMES API `);
            }
            tripInfo = {...tripInfo,
                ... {
                    latitude: json.geonames[0].lat,
                    longitude: json.geonames[0].lng
                }
            }
            params = [
                `key=${process.env.WEATHERBIT_TOKEN}`,
                `lat=${tripInfo.latitude}`,
                `lon=${tripInfo.longitude}`
            ]

            if (tripInfo.dayDiff <= 7) {
                return fetch(createLink(baseUrls.weatherBitCurrentWeather, params), { method: 'POST' })
            }
            return fetch(createLink(baseUrls.weatherBitForecastWeather, params), { method: 'POST' })

        })
        .then((response) => {

            if (response.status !== 200) {
                return Promise.reject(` WEATHERBIT API returned Status ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then((json) => {

            if (tripInfo.dayDiff <= 7) {
                if (!json.data[0]) {
                    return Promise.reject(` Could not gather data on WEATHERBIT API `);
                }
                res.send({
                    weatherType: 'current',
                    cityName: json.data[0].city_name,
                    countryCode: json.data[0].country_code,
                    weather: json.data[0].weather.description,
                    temperature: json.data[0].temp
                })
            } else {
                if (!Array.isArray(json.data))
                    return Promise.reject(` Could not gather data on WEATHERBIT API `);
                let chosenDay = json.data.pop();
                for (let day of json.data) {
                    if (day.datetime == tripInfo.startDate)
                        chosenDay = day;
                }
                res.send({
                    weatherType: 'forecast',
                    cityName: json.city_name,
                    countryCode: json.country_code,
                    weather: chosenDay.weather.description,
                    minTemperature: chosenDay.min_temp,
                    maxTemperature: chosenDay.max_temp,
                    date: chosenDay.datetime
                })
            }

        }).catch((error) => {
            console.log(error);
            next(error);
        });

});

app.post('/getLocationImage', (req, res, next) => {


    const { location } = req.body;
    let params = [
        `key=${process.env.PIXABAY_TOKEN}`,
        `q=${encodeURIComponent(location)}`,
        'image_type=photo',
        'page=1',
        'per_page=3'
    ];
    let completeLink = createLink(baseUrls.pixabay, params);
    console.log(`Requesting ${completeLink}`);
    fetch(completeLink, { method: 'POST' })
        .then((res) => {
            if (res.status !== 200) {
                return Promise.reject((` PIXABAY API returned Status ${res.status} - ${res.statusText}`));

            }
            return res.json();
        })
        .then((json) => {
            if (!json.hits[0]) {
                return Promise.reject(` Could not gather data on PIXABAY API `);

            }
            const img = json.hits[0].webformatURL;

            if (img) {
                return res.send({
                    image: img
                })
            }
        })
        .catch((error) => {
            next(error);
        });
});

app.use(function errorHandler(err, req, res, next) {
    res.status(500)
    return res.send({ error: err });
});
module.exports = app;