var express = require("express"),
    sweetroll = require("../sweetroll.js");

var app = express(),
    sweetie = sweetroll();

sweetie.at("/")
    .data(function(req) {
        return "test";
    })
    .render(function(req, data) {
        return data + " " + req.url;
    });

app.use(sweetie);

app.use(function(req, res, next) {
    res.send("Sweetie could not find anything for your request.");
});

app.listen(8080);
