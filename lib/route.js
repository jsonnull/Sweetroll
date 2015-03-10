/*
 * A Route object is created for every route specified to Sweetroll.
 */
var Route = function(route) {
    var the_route = this;

    this._route = route;
    this._data = function() { return };
    this._render = function() { return };

    this.data = function(fn) {
        the_route._data = fn;
        return the_route;
    }
    this.render = function(fn) {
        the_route._render = fn;
        return the_route;
    }
}

module.exports = Route;
