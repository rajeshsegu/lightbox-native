window.Dom = {

    querySelect: function(selector){
        return document.querySelectorAll(selector);
    },

    byId: function(id){
        return document.getElementById(id);
    },

    html: function(el, content){
        el.innerHTML = content;
    },

    getAncestor: function(cur, classValue){
        while ( (cur = cur.parentNode) ) {
            if(!cur || cur.className === classValue){
                break;
            }
        }
        return cur;
    },

    onClick: function(el, handler){
        Dom.addEvent(el, 'click', handler);
    },

    attr: function(el, attr, value){
        el.setAttribute(attr, value);
    },

    addEvent: function(el, type, handler){
        el.addEventListener(type, handler, false);
    },

    stopEvent: function(ev){
        ev.preventDefault();
        ev.stopPropagation();
    },

    onReady: function(callback){

        function completed(){
            callback();
            document.removeEventListener( "DOMContentLoaded", completed, false );
            window.removeEventListener( "load", completed, false );
        }

        // Use the handy event callback
        document.addEventListener( "DOMContentLoaded", completed, false );

        // A fallback to window.onload, that will always work
        window.addEventListener( "load", completed, false );

    },

    addClass: function(el, name){
        el.className = name;
    },

    addStyle: function(el, attr, value){
        el.style[attr] = value;
    },

    windowXY: function(){
        if( window.innerWidth ){
            return {
                WX: window.innerWidth,
                WY: window.innerHeight
            };
        }
        return {
            WX: document.body.clientWidth,
            WY: document.body.clientHeight
        };
    },

    show: function(el){
        Dom.addStyle(el, 'display', 'block');
    },

    hide: function(el){
        Dom.addStyle(el, 'display', 'none');
    },

    handleKeys: function(callback){
        document.onkeyup = callback;
    }

};