var http = require("http"),
    sweetroll = require("../sweetroll.js");

var app = sweetroll();

app.match(function(route, req) {
    return true;
});

app.at("*")
    .data(function(req) {
        return "This is the url I got:";
    })
    .render(function(req, data) {
        return data + " " + req.url;
    });

http.createServer(app).listen(8080);
