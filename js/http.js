
//HTTP Transportation Layer

//SAMPLE
// Http.GET('/api/flickr/stream?xyz=abc')
//  .header({'Accept': 'application/json, text/plain, */*'})
//  .success(onSuccessHandler)
//  .error(onErrorHandler)
//  .send();

var Http = function(method, url, async){

    var xhr = getXhr(method.toUpperCase(), url, async);

    function createXhr() {
        return new window.XMLHttpRequest();
    }

    function getXhr(method, url, async){
        var _xhr = createXhr();
        _xhr.open(method, url, async && true);
        return _xhr;
    }

    function header(headers){
        headers = headers || {};
        for(var key in headers){
            xhr.setRequestHeader(key, headers[key]);
        }
    }

    function send(post){
        xhr.send(post || null);
    }

    function onError(errCallback){
        xhr.onerror = function(){
            errCallback(-1, null, null, '');
        }
    }

    function onAbort(abortCallback){
        xhr.onerror = function(){
            abortCallback(-1, null, null, '');
        };
    }

    function onSuccess(successCallback){
        xhr.onload = function() {
            var statusText = xhr.statusText || '';
            var response = ('response' in xhr) ? xhr.response : xhr.responseText;
            var status = xhr.status === 1223 ? 204 : xhr.status;

            if(xhr.getResponseHeader('Content-Type').indexOf('application/json') != -1){
                response = JSON.parse(response);
            }

            successCallback(status, response, xhr.getAllResponseHeaders(), statusText);
        };
    }

    return {

        header: function(headers){
            header(headers);
            return this;
        },

        send: function(post){
            header({'Accept': 'application/json'});
            send(post);
            return this;
        },

        success: function(callback){
            onSuccess(callback);
            return this;
        },

        error: function(callback){
            onError(callback);
            onAbort(callback);
            return this;
        }

    }

};

Http.GET = function(url){
    return new Http('GET', url, true);
};

Http.POST = function(url){
    return new Http('POST', url, true);
};

Http.PUT = function(url){
    return new Http('PUT', url, true);
};

Http.DELETE = function(url){
    return new Http('DELETE', url, true);
};

