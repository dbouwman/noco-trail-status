/**
 * Curry - from https://gist.github.com/LeZuse/2631422
 */
Function.prototype.curry = function() {
    if (arguments.length < 1) {
        return this; //nothing to curry with - return function
    }
    var __method = this;
    var args = toArray(arguments);
    return function() {
        return __method.apply(this, args.concat(toArray(arguments)));
    }
}

function toArray (e) {
    return Array.prototype.slice.call(e);
}
