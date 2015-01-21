function simpleBind(context, fn) {
    return function () {
        fn.apply(context, arguments);
    };
}

//Overload Native JS Objects

function defineProperty(target, name, method, override) {

    if(!override && target[name]){
        return;
    }

    //Supported by IE9+, FF4+, Safari 5+, Chrome 5+
    if (Object.defineProperty) {
        Object.defineProperty(target, name, {
            'value': method,
            'configurable': false,
            'enumerable': false,
            'writable': false
        });
    } else {
        target[name] = method;
    }
}


defineProperty(Function.prototype, 'bind', function () {
    //My Function
    var that = this,
        args;

    //Cache all arguments following "thisObj"
    if (arguments.length > 1) {
        args = Array.prototype.slice.call(arguments, 1);
    }

    //Simple Closure
    return function() {

        //All arguments passed to the closure
        var args2 = Array.prototype.slice.call(arguments || []);

        //Execute original function "that" with a scope of "thisObj"
        //And apply arguments from original function and closure combined
        return that.apply(thisObj, args.concat(args2));
    };

});


defineProperty(String.prototype, 'formatString', function () {
    var str = this,
        argsArray = arguments;

    if(argsArray.length){
        return str.replace(/\{(\d+)\}/g, function(m, i) {
            return argsArray[i];
        });
    }

    return str;

});

defineProperty(Object.prototype, 'getPath', function (keyPath) {
    var keys, keyLen, i = 0, key,
        obj = this;

    keys = keyPath && keyPath.split('.');
    keyLen = keys && keys.length;

    while (i < keyLen && obj) {
        key = keys[i];
        obj = (typeof obj.get === 'function') ? obj.get(key) : obj[key];
        i++;
    }

    if (i < keyLen) {
        obj = null;
    }

    return obj;

});

defineProperty(String.prototype, 'addParams', function (params) {
    var urlParams = [];
    for(var key in params){
        urlParams.push('{0}={1}'.formatString(key, params[key]));
    }
    if(urlParams.length > 0){
        return ( this + '?' + urlParams.join('&') );
    }
    return this;
});




