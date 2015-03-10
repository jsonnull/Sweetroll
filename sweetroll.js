var url = require("url");
var Route = require("./lib/route.js");

var sweetroll = function() {

    var _routes = new Array();
    var _client = "/sweetroll-client.js";

    var _match = function(route, req) {
        if (req.url == route) {
            return true;
        }
        else
            return false
    }

    function app(req, res, next) {
        for (var i = 0; i < _routes.length; i++) {
            if (_match(_routes[i]._route, req)) {
                var data = _routes[i]._data(req);
                var render = _routes[i]._render(req, data);
                res.end(render);
                return;
            }
        }
        if (next)
            next();
    }

    app.at = function(route) {
        var _route = new Route(route);
        _routes.push(_route);
        return _route;
    }

    app.match = function(fn) {
        _match = fn;
    }

    app.client = function(path) {
        if (!path)
            path = _client;
        app.at(path).render(function() {
            // Serialize the routes variable to the JavaScript string.
            str = "var _routes = [";
            for (var i = 0; i < _routes.length; i++) {
                if (_routes[i]._route != path) {
                    str+="{"
                    for (key in _routes[i]) {
                        if (key != "_data" && key != "data" && key != "render") {
                            str+="\""+key+"\":"
                            if (typeof(_routes[i][key])=="string")
                                str+="\""+_routes[i][key]+"\"";
                            else
                                str+=_routes[i][key];
                            str+=","
                        }
                    }
                    str=str.slice(0,str.length-1);
                    str+="},"
                }
            }
            str=str.slice(0,str.length-1);
            str += "];"
            return str;
        });
    }

    return app;
}

module.exports = sweetroll;
