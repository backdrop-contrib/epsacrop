(function($) {
  Backdrop.EPSACrop = {
    api: null,
    preset: null,
    delta: null,
    presets: {},
    init: false,
    dialog: function(type_name, field_name, bundle, delta, img, trueSize) {
      $('body').find('#EPSACropDialog').remove().end().append('<div title="' + Backdrop.t("Cropping Image") + '" id="EPSACropDialog"></div>');

      // Translatables buttons
      var buttons = {};
      var saveLabel = Backdrop.t("Apply crop");
      var cancelLabel = Backdrop.t("Cancel");

      // Support multilingual sites with path prefixes. It's either this or
      // support for non-clean URL's, we can't have both.
      var pathPrefix = '?q=';
      if (Backdrop.settings.pathPrefix !== undefined && Backdrop.settings.pathPrefix != '') {
        pathPrefix = Backdrop.settings.pathPrefix;
      }

      buttons[saveLabel] = function() {
        var token = $('.epsacrop-global').data('token');
        $.post(Backdrop.settings.basePath + pathPrefix + 'crop/ajax/put/' + delta + '/' + token, {'coords': JSON.stringify(Backdrop.EPSACrop.presets)});
        var field = field_name.replace(/_/g, '-');
        var welem = $('div[id*="' + field + '"]').eq(0);
        if (welem.find('.warning').size() == 0) {
          welem.prepend('<div class="tabledrag-changed-warning messages warning">' + Backdrop.t("Changes made in image crops will not be saved until the form is submitted.") + '</div>');
        }
        $(this).dialog('close');
        $('#EPSACropDialog').remove();
      };
      buttons[cancelLabel] = function() {
        $(this).dialog('close');
        $('#EPSACropDialog').remove();
      };

      $('#EPSACropDialog').dialog({
        bgiframe: true,
        height: 600,
        width: 850,
        modal: true,
        draggable: false,
        resizable: false,
        overlay: {
          backgroundColor: '#000',
          opacity: 0.6
        },
        buttons: buttons,
        close: function() {
          $('#EPSACropDialog').remove();
        }
      }).load(Backdrop.settings.basePath + pathPrefix + 'crop/dialog/' + type_name + '/' + field_name + '/' + bundle + '/' + delta, function() {
        try {
          var item = $('.epsacrop-presets-menu a[class=selected]');
          var preset = item.attr('id');
          var coords = item.attr('rel').split('x');
          var aspectRatio = item.attr('data-aspect-ratio');
          var bgcolor = item.attr('data-bgcolor');
          var bgopacity = parseFloat(item.attr('data-bgopacity'));
          var coordinates_data =  decodeURIComponent($('.epsacrop-global').data('coordinates'));

          var w = parseInt(coords[0]);
          var h = parseInt(coords[1]);

          Backdrop.EPSACrop.preset = preset;
          if (Backdrop.EPSACrop.delta === null || Backdrop.EPSACrop.delta !== delta) {
            Backdrop.EPSACrop.init = false;
          }
          Backdrop.EPSACrop.delta = delta;

          presets = Backdrop.EPSACrop.presets || {};
          if (Backdrop.EPSACrop.init === false && coordinates_data.length > 0) {
            presets = JSON.parse(coordinates_data) || {};
            Backdrop.EPSACrop.init = true;
          }

          if ((typeof presets[delta] == 'object') && (typeof presets[delta][preset] == 'object')) {
            var c = presets[delta][preset];
          }

          // Change the ratio into numeric
          if (aspectRatio.length > 0) {
            if (aspectRatio.split('/').length == 0) {
              ratios = aspectRatio.split('/');
              aspectRatio = parseInt(ratios[0]) / parseInt(ratios[1]);
            }
            else {
              aspectRatio = parseFloat(aspectRatio);
            }
          }

          var target = $('#epsacrop-target');
          target.attr({'src': img});
          var targetWait = $('<p>loading...</p>');
          target.parent().append(targetWait);
          target.on("load", function() {
            targetWait.hide();
            Backdrop.EPSACrop.api = $.Jcrop('#' + target.attr('id'), {
              aspectRatio: (aspectRatio.length > 0) ? aspectRatio : (w / h),
              trueSize: trueSize,
              onSelect: Backdrop.EPSACrop.update,
              bgColor: bgcolor,
              bgOpacity: bgopacity,
              keySupport: false // fix the jump scroll
            }); // $.Jcrop
            // animateTo, to avoid one bug from Jcrop I guess,
            // He doesn't calculate the scale with setSelect at the begining, so
            // I add animateTo after initate the API.
            Backdrop.EPSACrop.api.animateTo(((typeof c == 'object') ? [c.x, c.y, c.x2, c.y2] : [0, 0, w, h]), function() {
              if (typeof presets[delta] == 'undefined') {
                presets[delta] = {};
              }
              if (typeof presets[delta][preset] == 'undefined') {
                presets[delta][preset] = Backdrop.EPSACrop.api.tellSelect();
              }
            });
          });
          Backdrop.EPSACrop.presets = presets || {};
        } catch (err) {
          alert(Backdrop.t("Error on load : @error", {'@error': err.message}));
        }
      }); // end load
    }, // end dialog
    crop: function(preset) {
      $('.epsacrop-presets-menu a').removeClass('selected');
      $('.epsacrop-presets-menu a#' + preset).addClass('selected');

      var item = $('.epsacrop-presets-menu a[class=selected]');
      var coords = item.attr('rel').split('x');
      var aspectRatio = item.attr('data-aspect-ratio');
      var bgcolor = item.attr('data-bgcolor');
      var bgopacity = parseFloat(item.attr('data-bgopacity'));
      var presets = Backdrop.EPSACrop.presets || {};
      var delta = Backdrop.EPSACrop.delta;

      var w = parseInt(coords[0]);
      var h = parseInt(coords[1]);

      // Change the ratio in numeric
      if (aspectRatio.length > 0) {
        if (aspectRatio.split('/').length == 0) {
          ratios = aspectRatio.split('/');
          aspectRatio = parseInt(ratios[0]) / parseInt(ratios[1]);
        }
        else {
          aspectRatio = parseFloat(aspectRatio);
        }
      }

      Backdrop.EPSACrop.preset = preset;

      if (typeof presets[delta] == 'object' && typeof presets[delta][preset] == 'object') {
        var c = presets[delta][preset];
        Backdrop.EPSACrop.api.animateTo([c.x, c.y, c.x2, c.y2]);
      }
      else {
        Backdrop.EPSACrop.api.animateTo([0, 0, w, h], function() {
          if (typeof presets[delta] == 'undefined') {
            presets[delta] = {};
          }
          if (typeof presets[delta][preset] == 'undefined') {
            presets[delta][preset] = Backdrop.EPSACrop.api.tellSelect();
          }
        });
      }
      Backdrop.EPSACrop.api.setOptions({
        aspectRatio: (aspectRatio.length > 0) ? aspectRatio : (w / h),
        bgColor: bgcolor,
        bgOpacity: bgopacity
      });
    },
    update: function(c) {
      var preset = Backdrop.EPSACrop.preset;
      var delta = Backdrop.EPSACrop.delta;
      var presets = Backdrop.EPSACrop.presets || {};

      if (typeof presets[delta] != 'object') {
        presets[delta] = {};
      }

      presets[delta][preset] = c;
      Backdrop.EPSACrop.presets = presets;
    }
  };
})(jQuery);
