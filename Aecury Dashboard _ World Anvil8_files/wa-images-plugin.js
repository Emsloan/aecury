// Custom plugin to fetch image urls by id and display them in WYSIWYG mode
sceditor.plugins.imageloader = function() {
  // Only execute if the editor instance is ready
  this.signalReady = function() {
    // Watch for content changing in the editor
    // imageLoader(event, true)
    this.bind('nodechanged',function(event) {
      imageLoader(event)
    }, false, true);
    // this.bind('nodechanged', imageLoader(event), false, true);
  }
}

function imageLoader(event, init = false) {
  // console.log('Plugin: nodechanged', event); // [DEBUG] For watching editor 'nodechanged' event
  // Get the frame and all image elements inside
  // if(!init){
    var frame = $(event.target).children('iframe')[0];
    var imgs = $(frame.contentDocument).find('img');
  // } else {
    // console.log('Not initialized!')
    // var frame = $(event.target).find('body').find('.wysiwyg-editor');
    // var imgs = $(frame).find('img');
    // console.log(frame, imgs)
  // }
  
  // Process each image
  if(imgs.length > 0) {
    for(var i = 0; i < imgs.length; i++) {
      var img = $(imgs[i]);
      // Get and set the src url for the image
      if(img.attr('src') === '#' && img.data('wa-img-id')) {
        // Retrieve the actual image data
        setImageUrl(img, img.data('wa-img-id'))
        var parent = img.parent()[0];
        if($(parent).data('wa-img-link') !== undefined) {
          var href = '/i/'+ img.data('wa-img-id');
          $(parent).attr('href', href);
        }
      }
    }
  }
}
// This asynchronous helper fetches the data
function setImageUrl(el, id) {
  var imgStore = localStorage.getItem('images');
  if(imgStore) {
    var images = JSON.parse(imgStore);
    for(var i = 0; i < images.length; i++) {
      if(images[i].id === id) {
        if(images[i].url){
          el.attr('src', images[i].url);
          return;
        }
      }
    }
  }

  // Retrieve and return the url for the given image ID
  $.getJSON('https://www.worldanvil.com/api/image/'+id).then(function(data) {
    if(data) {
      //Set the src to the returned result
      // console.log(data) // [DEBUG]: Display returned results
      el.attr('src', data.url);
      var store = [
        {
          id: id,
          url: data.url
        }
      ];
      localStorage.setItem('images', JSON.stringify(store));
    }
    return;
    //TODO: Check for exceptions
  })
}