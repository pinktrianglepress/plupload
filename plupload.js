//$Id$
(function($) {

Drupal.plupload = Drupal.plupload || {};

/**
 * Attaches the Plupload behavior to each Plupload form element.
 */
Drupal.behaviors.plupload = {
  attach: function(context, settings) {
    $(".plupload-element", context).once('plupload-init', function () {
      var $this = $(this);

      // Merge the default settings and the element settings to get a full
      // settings object to pass to the Plupload library for this element.
      var id = $this.attr('id');
      var defaultSettings = settings.plupload['_default'] ? settings.plupload['_default'] : {};
      var elementSettings = (id && settings.plupload[id]) ? settings.plupload[id] : {};
      var pluploadSettings = $.extend({}, defaultSettings, elementSettings);

      // Do additional requirements testing to prevent a less than ideal runtime
      // from being used. For example, the Plupload library treats Firefox 3.5
      // as supporting HTML 5, but this is incorrect, because Firefox 3.5
      // doesn't support the 'multiple' attribute for file input controls. So,
      // if settings.plupload._requirements.html5.mozilla = '1.9.2', then we
      // remove 'html5' from pluploadSettings.runtimes if $.browser.mozilla is
      // true and if $.browser.version is less than '1.9.2'.
      if (settings.plupload['_requirements'] && pluploadSettings.runtimes) {
        var runtimes = pluploadSettings.runtimes.split(',');
        var filteredRuntimes = [];
        for (var i = 0; i < runtimes.length; i++) {
          var includeRuntime = true;
          if (settings.plupload['_requirements'][runtimes[i]]) {
            var requirements = settings.plupload['_requirements'][runtimes[i]];
            for (var browser in requirements) {
              if ($.browser[browser] && Drupal.plupload.compareVersions($.browser.version, requirements[browser]) < 0) {
                includeRuntime = false;
              }
            }
          }
          if (includeRuntime) {
            filteredRuntimes.push(runtimes[i]);
          }
        }
        pluploadSettings.runtimes = filteredRuntimes.join(',');
      }

      // Initialize Plupload for this element.
      $this.pluploadQueue(pluploadSettings);

      // Client side form validation (see
      // http://plupload.com/example_queuewidget.php)
      $this.closest('form').submit(function(e) {
        var $form = $(this);
        var uploader = $('.plupload-element', this).pluploadQueue();

        // Validate number of uploaded files
        if (uploader.total.uploaded == 0) {
          // Files in queue upload them first
          if (uploader.files.length > 0) {
            // When all files are uploaded submit form
            uploader.bind('UploadProgress',
            function() {
              if (uploader.total.uploaded == uploader.files.length) {
                $form.submit();
              }
            });

            uploader.start();
          } else alert('You must at least upload one file.');

          e.preventDefault();
        }
      });
    });
  }
}

/**
 * Helper function to compare version strings.
 *
 * Returns one of:
 *   - A negative integer if a < b.
 *   - A positive integer if a > b.
 *   - 0 if a == b.
 */
Drupal.plupload.compareVersions = function (a, b) {
  a = a.split('.');
  b = b.split('.');
  // Return the most significant difference, if there is one.
  for (var i=0; i < Math.min(a.length, b.length); i++) {
    var compare = parseInt(a[i]) - parseInt(b[i]);
    if (compare != 0) {
      return compare;
    }
  }
  // If the common parts of the two version strings are equal, the greater
  // version number is the one with the most sections.
  return a.length - b.length;
}

})(jQuery);
