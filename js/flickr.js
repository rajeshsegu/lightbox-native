var FlickrOps = function(apiKey){
    this.API_KEY = apiKey;
};

FlickrOps.API = 'https://api.flickr.com/services/rest/';
FlickrOps.S_URL = 'http://farm{0}.static.flickr.com/{1}/{2}_{3}_s.jpg';
FlickrOps.M_URL = 'http://farm{0}.static.flickr.com/{1}/{2}_{3}_m.jpg';
FlickrOps.L_URL = 'http://farm{0}.static.flickr.com/{1}/{2}_{3}_b.jpg';

FlickrOps.prototype = {

    API_KEY: null,

    getPhotosUrl: function(page){
        var params = {
            method: 'flickr.photosets.getPhotos',
            format: 'json',
            nojsoncallback: 1,
            per_page: 25,
            page: page || 1,
            api_key: this.API_KEY,
            photoset_id:'72157626579923453'
        };

        return FlickrOps.API.addParams(params);
    },

    getPhotos: function(page, successCallback, errorCallback){
        var self = this;
        Http.GET(this.getPhotosUrl(page))
            .success(function(status, response){
                var photos = response.getPath('photoset.photo');
                if(photos) {
                    successCallback(self.processPhotos(photos));
                }else{
                    errorCallback(response);
                }
            })
            .error(errorCallback)
            .send();
    },

    processPhotos: function(photos){
        photos.forEach(function(photo){
            photo.sUrl = FlickrOps.S_URL.formatString(photo.farm, photo.server, photo.id, photo.secret);
            photo.mUrl = FlickrOps.M_URL.formatString(photo.farm, photo.server, photo.id, photo.secret);
            photo.lUrl = FlickrOps.L_URL.formatString(photo.farm, photo.server, photo.id, photo.secret);
        });
        return photos;
    },

    init: function(successCallback, errorCallback){
        this.getPhotos(1, successCallback, errorCallback);
    }

};

//Self invocation
(function(window){
    var API_KEY='c5e1a9e12a28f7e220bc76b21027a1e2';
    window.Flickr = new FlickrOps(API_KEY);
})(window);


