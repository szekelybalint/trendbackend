const express = require('express');
const server = express();
const port = 4000;
const googleTrends = require('google-trends-api');
const trends = require('node-google-search-trends');

server.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

server.get('/overtime/:keyword/', (req, res, next) => {
    const kw = req.params.keyword;


    googleTrends

        .interestOverTime({ keyword: kw})

        .then(function(results) {
            res.status(200).send(results);

        })

        .catch(function(err) {

            console.error("Oh no there was an error", err);

        });


});

server.get('/byregion/:keyword/', (req, res, next) => {
    const kw = req.params.keyword;


    googleTrends.interestByRegion({keyword: kw, resolution: 'CITY'})
        .then((results) => {
            res.status(200).send(results);
        })
        .catch((err) => {
            console.log(err);
        })



});
server.get('/byregion/:keyword/:date', (req, res, next) => {
    const kw = req.params.keyword;
    const d = req.params.date;


    googleTrends.interestByRegion({keyword: kw, startTime: new Date(d)})
        .then((results) => {
            res.status(200).send(results);
        })
        .catch((err) => {
            console.log(err);
        })



});

server.get('/top/:country', (req, res, next) => {
    const country = req.params.country;

    try{
    trends(country, 10, function(err, data) {
        if (err) return console.log(err);
        res.status(200).send(data);  // Pretty prints JSON 'data'
    })}
    catch(err){
        console.log(err);
    }


});

server.listen(port, () => console.log(`Trendmap backend running on localhost:${port}!`))