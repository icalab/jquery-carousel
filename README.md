# jquery-carousel
jQuery-plugin for grouping all images inside a container into a simple carousel.

## Usage

    $(container).icaCarousel(options)

## Options

 * **numSecondsToShow** the number of seconds to show a single image (defaults to 4)
 * **numSecondsToFade** the duration of a fade event in seconds (defautls to 0.25)
 * **buttonWidth** the width of a prev / next button (defaults to 40)
 * **buttonHeight** the height of a prev / next button (defaults to 40),
 * **imagesWrapperPadding** padding for the image wrapper (defaults to 5),
 * **imageContainerSelector** if this is null (the default) all the images in the container are grouped into a single carousel. If it is not null, images in adjacent instances of the image container selector are grouped into carousels but only if there's more than one of them in succession.
 * **displayAt** if the imageContainerSelector is null, this option determines where in the container the carousel is shown. Possible values are 'start' (the default), 'end' and 'firstImage' (where the carousel occurs at the location of the first image in the container).
 * **carouselMaxHeight** the maximum height of the carousel. Defaults to 0 (the height of the largest image inside the carousel)
 * **carouselMaxWidth** the maximum width of the carousel. Defaults to 0 (the height of the largest image inside the carousel)
 * **showPreview** if true, preview images will be shown for the previous and the next images (defaults to false)
 * **previewWidth** the width of a preview image (defaults to 100)
 * **previewHeight** the height of a preview image (defaults to 60)
 * **previewPadding** the padding surrounding a preview image (defaults to 10)

