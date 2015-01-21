//Images Collection View

function ImageCollectionView(lightboxView){

    this.containerEl =  Dom.querySelect('#lightbox ul.collection')[0];
    this.loadingEl = Dom.querySelect('h1.loading')[0];
    this.errorEl = Dom.querySelect('h1.error')[0];
    this.lightboxView = lightboxView;

    this._photosMap = {};
    this._activeItem = null;

    Dom.addEvent(this.containerEl, 'click', simpleBind(this, this.selectItem));

    this.handleKeys();

}

ImageCollectionView.prototype = {

    loading: function(show){
        if(show){
            this.error(false);
            Dom.show(this.loadingEl);
        }else{
            Dom.hide(this.loadingEl);
        }
    },

    error: function(show, str){
        if(show){
            this.loading(false);
            Dom.html(this.errorEl, str);
            Dom.show(this.errorEl);
        }else{
            Dom.html('');
            Dom.hide(this.errorEl);
        }
    },

    navigate: function(direction){

        //var nextPhoto = null; //this._photos[this._activeItem];
        if(direction == -1){ //left
            if(this._activeItem > 0){
                this._activeItem--;
            }
        }else if(direction == 1){ //right
            if(this._activeItem < this._photos.length-1){
                this._activeItem++;
            }
        }

        this.lightboxView.displayPhoto(this._photos[this._activeItem]);


    },

    handleKeys: function(){
        var self = this;
        Dom.handleKeys(function(ev){
            if(!self._activeItem) return;

            if(ev.which == 37){ //left
                self.navigate(-1);
            }else if(ev.which == 39){ //right
                self.navigate(1);
            }else if(ev.which == 27){ //esc
                self.lightboxView.hide();
            }
        });
    },

    getPhotoHTML: function(photo, index){
        var template = [
            '<div class="item" id="',photo.id,'" index="',index,'">',
                '<img src="', photo.mUrl, '" data-large="', photo.lUrl, '"/>',
                '<div class="image_title">',
                    '<h5 class="title">',photo.title,'</h5>',
                '</div>',
            '</div>'
        ];
        return template.join('');
    },

    renderPhoto: function(html){

        var span = document.createElement("li");
        span.innerHTML = html;

        var frag = document.createDocumentFragment();
        frag.appendChild(span);

        this.containerEl.appendChild(frag);
    },

    addPhotos: function(photos){
        var self = this;
        this._photos = photos;
        photos.forEach(function(photo, index){
            if(self._photosMap[photo.id]) return;
            self._photosMap[photo.id] = photo;
            self.renderPhoto(self.getPhotoHTML(photo, index));
        });
    },

    morePhotos: function(photos){
        this._photos = this._photos.concat(photos);
        this.addPhotos(this._photos, true);
    },

    selectItem: function(ev){

        ev = ev || window.event;

        var curEl = ev.target,
            itemEl = Dom.getAncestor(curEl, 'item'),
            id = itemEl.getAttribute('id'),
            index = itemEl.getAttribute('index'),
            photo = this._photosMap[id];

        this._activeItem = index;

        this.lightboxView.displayPhoto(photo);

        Dom.stopEvent(ev);

    }

};

//Lightbox View

function LightBoxView(){

    this.containerEl = Dom.byId('lightbox-super-container');
    this.imgEl = Dom.byId('lightbox-super-image');
    this.titleEl = Dom.byId('lightbox-super-title');
    this.wrapEl = Dom.querySelect('.lightbox-wrap')[0];
    this.closeEl = Dom.querySelect('#lightbox-super-container .lightbox-close')[0];
    this.nextEl = Dom.querySelect('#lightbox-super-container .lightbox-next')[0];
    this.prevEl = Dom.querySelect('#lightbox-super-container .lightbox-prev')[0];

    //Image load
    Dom.addEvent(this.imgEl, 'load', simpleBind(this, function(){
        this.show();
        this.centerImage();
    }));

    //Controls
    Dom.addEvent(this.closeEl, 'click', simpleBind(this, function(ev){
        this.hide();
        Dom.stopEvent(ev);
    }));

    Dom.addEvent(this.nextEl, 'click', simpleBind(this, function(ev){
        this._navHandler(1);
        Dom.stopEvent(ev);
    }));

    Dom.addEvent(this.prevEl, 'click', simpleBind(this, function(ev){
        this._navHandler(-1);
        Dom.stopEvent(ev);
    }));

}

LightBoxView.prototype = {

    containerEl: null,

    imgEl: null,

    titleEl: null,

    handleNav: function(callback){
        this._navHandler = callback;
    },

    displayPhoto: function(photo){
        this.setImage(photo.lUrl);
        this.setTitle(photo.title);
    },

    show: function(){
        Dom.show(this.containerEl);
    },

    hide: function(){
        Dom.hide(this.containerEl);
    },

    setTitle: function(title){
        Dom.html(this.titleEl, title);
    },

    setImage: function(url){
        Dom.attr(this.imgEl, 'src', url);
    },

    centerImage: function(){
        var OW = this.wrapEl.offsetWidth,
            OH = this.wrapEl.offsetHeight,
            WIN = Dom.windowXY(),
            L, T;

        L = ( WIN.WX - OW )/2;
        T = ( WIN.WY - OH )/2;

        Dom.addStyle(this.wrapEl, 'left', L+'px');
        Dom.addStyle(this.wrapEl, 'top', T+'px');
    }

};



Dom.onReady(function(){

    var lightBoxView = new LightBoxView(),
        imageCollectionView = new ImageCollectionView(lightBoxView),
        pageNo = 1;

    function loadPhotos(page){
        imageCollectionView.loading(true);
        Flickr.getPhotos(page, function(photos){
            if(pageNo == 1){
                imageCollectionView.addPhotos(photos);
            }else{
                imageCollectionView.morePhotos(photos);
            }
            imageCollectionView.loading(false);
        }, function(err){
            imageCollectionView.error(true, err.message);
        });
    }

    function handleMore(){
        var moreEl = Dom.querySelect('.morebox')[0];
        Dom.addEvent(moreEl, 'click', function(){
            pageNo = pageNo + 1;
            loadPhotos(pageNo);
        });
    }


    lightBoxView.handleNav(simpleBind(imageCollectionView, imageCollectionView.navigate));

    loadPhotos(pageNo);

    handleMore();

});
