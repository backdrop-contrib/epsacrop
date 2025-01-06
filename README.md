
EPSA Crop - Image Cropping
======================

EPSA Crop is a module that allows a user to choose coordinates for different
styles on an image. If a user defines coordinates EPSACrop will create a image
with the points.

If the user doesn't change the coordinates, the normal crop process is applied.


Requirements
------------

EPSACrop requires that the following modules are enabled:
 - Image
 - [Libraries](https://www.drupal.org/project/libraries)

EPSACrop requires that the following external libraries are installed:
 - [JCrop](https://jcrop.com/)
 - [json2](https://github.com/douglascrockford/JSON-js)


Installation
------------

1. Download the EPSAcrop module and place it into your modules directory.

2. Download and unpack the JCrop library. Rename the resulting directory to
   'Jcrop' and place into the libraries directory (ex.: sites/all/libraries/Jcrop).

3. Download the and unpack the json2 library. Rename the resulting directory to
   'json2' and place it into the libraries directory (ex.: sites/all/libraries/json2).

4. Go to admin/build/modules and enable EPSA Crop.

Configuration
------------

1. Enable the module and set the permissions at People -> Permissions.

2. Go to Configuration -> Media -> Image styles and change/add an image style.
   Add the effect 'EPSA Image crop' to any style.

3. Adjust the field settings for any Image field. For a content type, the field
   settings are located at Structure -> Content Type -> {type} -> Manage fields.
   Click 'edit' and select Available EPSACrop styles under "EPSACrop settings".
   (All image styles containing the 'EPSA Image crop' effect should appear.)

4. Adjust the field display settings for this image field. For a content type,
   the field display settings are located at
   Structure -> Content Type -> {type} -> Manage display. Select the image style
   chosen in step 3 again to see your cropped image display.



Issues
------
Bugs and feature requests should be reported in [the Issue Queue](https://github.com/backdrop-contrib/epsacrop/issues).


Current Maintainers
-------------------
* [Juan Olalla](https://www.drupal.org/u/juanolalla)


Credits
-------

- Ported to Backdrop CMS by [Juan Olalla](https://www.drupal.org/u/juanolalla).
- Drupal 7 maintainer [cb](https://www.drupal.org/u/cb).
