Lightbox Demo
===========

Image Lightbox Demo based on native JavaScript ( no libraries )

#Features:
1. Fetch Images dynamically from Flickr
2. Lightbox Image View 
3. Navigate trough Images ( control buttons, keyboard arrows/esc )

#JavaScript: 

1. Pure native JS with prototype inheritance
2. Http layer built from scratch
```
Http.GET('/api/flickr/stream?xyz=abc')
  .header({'Accept': 'application/json, text/plain, */*'})
  .success(onSuccessHandler)
  .error(onErrorHandler)
  .send();
```

#Screenshot

![Lightbox Demo Screenshot](https://raw.githubusercontent.com/rajeshsegu/lightbox-native/master/demo/Lightbox%20Demo.png)
