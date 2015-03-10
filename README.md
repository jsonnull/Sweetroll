# Sweetroll

Sweetroll is a light, minimalist, DRY, isomorphic toolkit for HTML+JS applications with Node.js.

``` js
var connect = require("connect"),
    sweetroll = require("sweetroll");

var app = sweetroll();

app.at("/")
    .data(function(req) {
        return "world";
    })
    .render(function(req, data) {
        return "Hello "+data;
    });

app.serve("/scripts/client.js");

connect().use(app).listen(80);
```

## Why Sweetroll?

You shouldn't have to write your web application twice: once on the server and once again on the client. Sweetroll rolls your server and app into one easy-to-build-and-maintain codebase. Here's a glance at what to look for from Sweetroll:

1. DRY design: Craft your app with one codebase--Sweetroll will intelligently bundle client code for you. API routes and rendering code, so the client only gets the code it needs.
2. Automatic (progressive) enhancement: Sweetroll shares your API and rendering code with the client, so it can query the server for data to render client-side (a la single-page apps). Your app gets an automatic speedup and costs you no development time.
3. Control: Sweetroll streamlines development without forcing you to give up the fine control you regularly enjoy with Node.js. Work with express, connect, or vanilla http.

## Installation

`npm install sweetroll`

## API

### sweetroll()

Creates a new sweetroll context, a function with a `req, res, next` signature.

This can be used with http:

``` js
var http = require("http"),
    sweetroll = require("sweetroll");

var app = sweetroll();

http.createServer(app).listen(8080);
```

It can also be used with express and connect:

``` js
var express = require("express"),
    sweetroll = require("sweetroll");

var app = express(),
    sweetie = sweetroll();

app.use(sweetie);

// Do other express routing...

app.use(function(req, res, next) {
    res.send("Sweetie could not find anything for your request.");
});

app.listen(8080);
```

``` js
var connect = require("connect"),
    sweetroll = require("sweetroll");

var app = sweetroll();

connect()
    .use(app)
    .use(function(req, res) {
        res.end("Sweetroll could not find anything for your request.");
    })
    .listen(8080);
```

### app.at(route)

Specifies a route that your app will try to match on every request. Depending on your match function, this will usually be a string, but could be a regexp object.

The at() method returns a Route object.

``` js
var app = sweetroll();

app.at("/").render(function(req) {
    return "You made a request for the root page!";
});
```

### Route.data(fn)

When a route is matched, `data` function on that route is executed on the server to interact with a database or run other custom server logic. The `request` object from the server (or connect or express) is always provided as a parameter. To pass data out of the data function, simply `return` it. _Note, that currently requiring the return from the function makes this a blocking operation. A fix is coming soon._

``` js
app
    .at("/feeds/json/latest")
    .data(function(req) {
        return db.query("_changes/latest");
    });
```

### Route.render(fn)

When a route is matched, `render` acts on the return value from the `data` step. This is useful for rendering data fresh from the database into HTML and placing it in the document. If the client library is being used, this render function will act on the same data from the earlier step, retrieved by AJAX. In order to use this feature, you will have to make sure that `render` has its dependencies satisfied on both the client and server. The render function is always provided with the `request` from the server and the `data` from the data step. _Once again, note that currently the return from this function makes it a blocking operation._

``` js
app.at("/hello_world")
    .data(function(req) {
        return "world";
    })
    .render(function(req, data) {
        return "Hello "+data;
    });
```

### app.match(fn)

Sometimes you may want to exercise control over how requests into the server are compared with routes. For this, there is the match function. You can pass a function into `app.match` with accepts the parameters `req` and `route`, where `route` is the value you entered in `app.at(route)`. You can use this to write a custom match function which works on regular expressions as routes, or accepts different degrees of matches, such as matching the entire url, just the query string, etc. The result of the match function should be a boolean, where true is returned on a match.

Here is the default match function:

``` js
if (req.url == route) {
    return true;
}
else {
    return false
}
```

Here is how you could specify your own:

``` js
app.match(function(req, route) {
    if (req.url.search(route) != -1)
        return true;
    return false;
});
```

### app.client([route])

To use the client library, call the `app.client` method, optionally specifying the route where the .js file will be served. If no route is provided, the default string `"/sweetroll-client.js"` is used. When this route is matched the client-side sweetroll library is composed and served.

``` js
app.client("/scripts/client.js");
```

## Client Library

The client library is served when you enable the route using `app.client`. The client library includes a small amount of client-specific code as well as all of the routes and rendering functions as specified on the server. The client library intercepts anchor clicks and attempts to match these links to the routes already specified. If a route is matched, an AJAX request is made to the server that returns only the data from the `data` function, and is applied to the `render` function on the client. In this way, you can easily craft a search-engine friendly single-page app by just writing your server routing, data, and rendering functionality.

Care should be taken to ensure that the render function can make the necessary modifications to the client page if this feature can be used.

The client library is off by default, and is not served until you use `app.client` and include the script in your page.
