/**
 * Group images into one or more carousels.
 *
 * Usage: $(container).icaCarousel(options)
 *
 * Options:
 *
 *    numSecondsToShow: the number of seconds to show a single image (defaults
 *    to 4)
 *    numSecondsToFade: the duration of a fade event in seconds (defautls to 0.25)
 *    buttonWidth: the width of a prev / next button (defaults to 40),
 *    buttonHeight: the height of a prev / next button (defaults to 40),
 *    imagesWrapperPadding: padding for the image wrapper (defaults to 5),
 *    imageContainerSelector: if this is null (the default) all the images in
 *    the container are grouped into a single carousel. If it is not null,
 *    images in adjacent instances of the image container selector are grouped into carousels
 *    but only if there's more than one of them in succession.
 *    displayAt: if the imageContainerSelector is null, this option determines
 *    where in the container the carousel is shown. Possible values are 'start' (the default), 'end' and 'firstImage' (where the carousel occurs at the location of the first image in the container).
 *    carouselMaxHeight : the maximum height of the carousel. Defaults to
 *    0 (the height of the largest image inside the carousel)
 *    carouselMaxWidth: the maximum width of the carousel. Defaults to 0 (the
 *    height of the largest image inside the carousel)
 *    showPreview : if true, preview images will be shown for the previous and
 *    the next images (defaults to false)
 *    previewWidth : the width of a preview image (defaults to 100)
 *    previewHeight : the height of a preview image (defaults to 60)
 *    previewPadding : the padding surrounding a preview image (defaults to
 *    10)
 */

(function ($) {

  /**
   * Load the preview images.
   * @param options the carousel options
   * @param container the carousel
   */
  var _icShowPreviewImages = function(options, container) {
    
    var displayedImage = container.find('.images img:visible');

    var prevImage = displayedImage.prev();
    if(! prevImage[0]) {
      prevImage = container.find('.images img').last();
    }
    var nextImage = displayedImage.next();
    if(! nextImage[0]) {
      nextImage = container.find('.images img').first();
    }

    var scalePreview = function(image) {
      var width = image.width();
      var height = image.height();
      var maxWidth = image.parent().width();
      var maxHeight = image.parent().height();
      if(width > maxWidth) {
        var newWidth = maxWidth;
        var newHeight = (newWidth * height) / width;
        height = newHeight;
        width = newHeight;
      }
      if(height > maxHeight) {
        var newHeight = maxHeight;
        var newWidth = (newHeight * width) / height;
        height = newHeight;
        width = newHeight;
      }

      image.css({
        'width' : width,
        'height' : height,
      });
    
    }

    scalePreview(container.find('.preview-before img').attr('src', prevImage.attr('src')).css({'width' : prevImage.width(), 'height' : prevImage.height()}));
    scalePreview(container.find('.preview-after img').attr('src', nextImage.attr('src')).css({'width' : nextImage.width(), 'height' : nextImage.height()}));
  };

  /**
   * Show the next image in a series of images inside a container.
   * @param options carousel options
   * @param container the container
   */
 var  _icShowNextImage = function(options, container) {

    clearTimeout(container.attr('timeouthandle'));
    var indexNext = 0;
    var images = $(container).find('.images img');
    var imageToHide = null;
    for(var i = 0; i < images.length; i++) {
      if($(images[i]).is(':visible')) {
        indexNext = i + 1;
        imageToHide = $(images[i]);
        break;
      }
    }
    if(indexNext >= images.length) {
      indexNext = 0;
    }
    imageToHide.fadeOut(options.numSecondsToFade * 1000,
                        function() {
                          $(images[indexNext]).fadeIn(options.numSecondsToFade * 1000);
    if(options.showPreview) {
      _icShowPreviewImages(options, container);
    }
                        });

    
    container.attr('timeouthandle', setTimeout(function() {
      _icShowNextImage(options, container)
    }, options.numSecondsToShow * 1000));
  };

  /**
   * Show the previous image in a series of images inside a container.
   * @param options carousel options
   * @param container the container
   */
  var _icShowPreviousImage = function(options, container) {

    clearTimeout(container.attr('timeouthandle'));

    var indexNext = 0;
    var images = $(container).find('.images img');
    var imageToHide = null;
    for(var i = images.length - 1; i >= 0; i--) {
      if($(images[i]).is(':visible')) {
        indexNext = i - 1;
        imageToHide = $(images[i]);
        break;
      }
    }
    if(indexNext < 0) {
      indexNext = images.length - 1;
    }
    imageToHide.fadeOut(options.numSecondsToFade * 1000,
                        function() {
                          $(images[indexNext]).fadeIn(options.numSecondsToFade * 1000);
                          if(options.showPreview) {
                            _icShowPreviewImages(options, container);
                          }

     });


     container.attr('timeouthandle', setTimeout(function() {
       _icShowNextImage(options, container)
     }, options.numSecondsToShow * 1000));
  };


  /**
   * Merge the images in a group to a carousel.
   * @param wrapper the wrapper that needs to hold the carousel
   * @param imageGroup the images that need to be grouped
   * @param options options for the carousel
   */ 
  var _icMergeToCarousel = function(wrapper, imageGroup, options) {

    var numImages = imageGroup.length;
    // Figure out the max height and width. This has to be done here, while the images
    // are still all in view.
    var maxHeight = 0;
    var maxWidth = 0;

    var previewWidth = 0;
    if(options.showPreview) {
      previewWidth = (options.previewWidth + options.previewPadding * 2) * 2;
    }
    console.log(previewWidth);

    for(var i = 0; i < numImages; i++) {
      var image = imageGroup[i];
      var height = image.height();
      var width = image.width();

      // Scale as needed.
      if(options.carouselMaxWidth
         && options.carouselMaxWidth < width + options.buttonWidth * 2 + options.imagesWrapperPadding * 2 + previewWidth) {
           newWidth = options.carouselMaxWidth - options.buttonWidth * 2 - options.imagesWrapperPadding * 2 - previewWidth;
           newHeight = (newWidth * height) / width;
           height = newHeight;
           width = newWidth;

      }
      if(options.carouselMaxHeight
         && options.carouselMaxHeight < height + options.imagesWrapperPadding * 2) {
           newHeight = options.carouselMaxHeight - options.imagesWrapperPadding * 2;
           newWidth = (newHeight * width) / height;
           height = newHeight;
           width = newWidth;
      }

      if(height > maxHeight) {
        maxHeight = height;
      }
      if(width > maxWidth) {
        maxWidth = width;
      }
      // Explicitly set the width, height and margin for each image.
      image.css({
        'width' : width,
        'height' : height,
        'display' : 'block',
        'margin' : 'auto',
        'margin-top' : (maxHeight - height) / 2,
      });
    }

    // Create a carousel div.
    var carouselWrapper;
    var carouselWrapperHtml = '<div class="image-carousel">'
        + '<span class="nav-button prev-button">&lt;</span>'
        + '<div class="images"></div>'
        + '<span class="nav-button next-button">&gt;</span>';
    if(options.imageContainerSelector) {
      var container = imageGroup[0].parents(options.imageContainerSelector);
      container.before(carouselWrapperHtml);
        carouselWrapper = container.prev();
    }
    else {
      if(options.displayAt == 'end') {
        wrapper.append(carouselWrapperHtml);
      }
      else if(options.displayAt == 'firstImage') {
        imageGroup[0].before(carouselWrapperHtml);
        carouselWrapper = imageGroup[0].prev();
      }
      else {
        wrapper.prepend(carouselWrapperHtml);
      }
      carouselWrapper = wrapper.find('div.image-carousel');
    }
    carouselWrapper.css({
      'height' : maxHeight + (options.imagesWrapperPadding * 2),
      'width' : maxWidth + (options.buttonWidth * 2) + (options.imagesWrapperPadding * 2) + previewWidth,
      'display' : 'block',
      'float' : 'none',
      'margin' : 'auto',
    });
    carouselWrapper.find('span.nav-button').css({
      'width' : options.buttonWidth,
      'height' : options.buttonHeight,
      'display' : 'block',
      'float' : 'left',
      'margin-top' : (maxHeight - options.buttonHeight) / 2,
    });
    carouselWrapper.find('.images').css({
      'width' : maxWidth + (options.imagesWrapperPadding * 2),
      'height' : maxHeight + (options.imagesWrapperPadding * 2),
      'display' : 'block',
      'float' : 'left',
    });

    // Add previews to the carousel if needed
    if(options.showPreview) {
      carouselWrapper.find('.images').before('<div class="preview preview-before"><img></div>');
      carouselWrapper.find('.images').after('<div class="preview preview-after"><img></div>');
      carouselWrapper.find('.preview').css({
        'width' : options.previewWidth + options.previewPadding * 2,
        'height' : options.previewHeight, // No need to add padding as there's nothing above or below it.
        'padding-left' : options.previewPadding,
        'padding-right' : options.previewPadding,
        'margin-top' : (carouselWrapper.height() - options.previewHeight) / 2,
        'display' : 'block',
        'float' : 'left',
      });
      carouselWrapper.find('.preview-before').click(function() {
        _icShowPreviousImage(options, carouselWrapper);
      });
      carouselWrapper.find('.preview-after').click(function() {
        _icShowNextImage(options, carouselWrapper);
      });
    }

    // Add all images to the carousel.
    for(var i = 0; i < numImages; i++) {
      var container = null;
      if(options.imageContainerSelector) {
        container = imageGroup[i].parents(options.imageContainerSelector);
      }
      imageGroup[i].appendTo(carouselWrapper.find('.images'));
      if(container) {
        container.remove();
      }
    }

    // Hide all images except the first.
    carouselWrapper.find('.images img').hide();
    carouselWrapper.find('.images img').first().show();
    if(options.showPreview) {
      _icShowPreviewImages(options, carouselWrapper);
    }

    // Now cycle through the images in the carousel.
    carouselWrapper.attr('timeouthandle', setTimeout(function() {
      _icShowNextImage(options, carouselWrapper)
    }, options.numSecondsToShow * 1000));
    
    // Wire up the previous and next buttons.
    carouselWrapper.find('.prev-button').click(function() {
      _icShowPreviousImage(options, carouselWrapper);
    });
    carouselWrapper.find('.next-button').click(function() {
      _icShowNextImage(options, carouselWrapper);
    });


  };
  /**
   * Initialize a carousel.
   * @param wrapper the html object (extended) in which the images are to be
   * found
   * @param options options for the carousels. See the main function for
   * details.
  */
  var _icInit = function(wrapper, options) {

    // Default options.
    var defaultOptions = {
      numSecondsToShow: 4,
      numSecondsToFade: 0.25,
      buttonWidth: 40,
      buttonHeight: 40,
      imagesWrapperPadding: 5,
      imageContainerSelector: null,
      displayAt: 'start', // start, end, firstImage
      carouselMaxWidth: 0,
      carouselMaxHeight: 0,
      showPreview: false,
      previewWidth: 100,
      previewHeight: 60,
      previewPadding: 10,

    };

    // Load alternate options as needed.
    if(typeof options === undefined) {
      options = {};
    }
    for(optionKey in defaultOptions) {
      if( ! options.hasOwnProperty(optionKey)) {
        options[optionKey] = defaultOptions[optionKey];
      }
    }

    // Group images.
    var imageGroups = [];
    var currentImageGroup = [];
    if(options.imageContainerSelector) {
      wrapper.find(options.imageContainerSelector).each(function() {
        var img = $(this).find('img');
        if(img[0]) {
          currentImageGroup.push(img);
        }
        // The current content item does not contain an image.
        else {
          if(currentImageGroup.length > 0) {
            imageGroups.push(currentImageGroup);
            currentImageGroup = [];
          }
        }
      });
      if(currentImageGroup.length) {
        imageGroups.push(currentImageGroup);
      }
    }
    // No image container selector is set. Simply group all images.
    else {
      wrapper.find('img').each(function() {
        currentImageGroup.push($(this));
      });
      imageGroups[0] = currentImageGroup;
    }

    // Replace images with carousels as needed.
    for(var i = 0; i < imageGroups.length; i++) {
      if(imageGroups[i].length > 1) {
        _icMergeToCarousel(wrapper, imageGroups[i], options);
      }
    }
  };

  /**
   * Look for images inside a container and group them into carousels.
   * @param options options (todo)
   */
  $.fn.icaCarousel = function(options) {

    // The carousel can only be created after window load has happened
    // (the images need to have a size).
    if(document.readyState != 'complete') {
      var wrapper = this;
      $(window).load(function() {
        _icInit(wrapper, options);
      });
    } else {
      _icInit(this, options);
    }
    return this;  
  };
}(jQuery));
