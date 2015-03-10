var connect = require("connect"),
    sweetroll = require("../sweetroll.js");

var app = sweetroll();

app.at("/")
    .data(function(req) {
        return "test";
    })
    .render(function(req, data) {
        return data + " " + req.url;
    });

app.client("/scripts/client.js");

connect()
    .use(app)
    .use(function(req, res) {
        res.end("There was nothing at your location.");
    })
    .listen(8080);
