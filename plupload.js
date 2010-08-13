//$Id$

(function($) {
  Drupal.behaviors.plupload = {
    attach: function(context, settings) {
      $(".plupload-element", context).once('plupload-init', function () {
        $this = $(this);
        $this.pluploadQueue({
          // General settings
          runtimes: 'gears,browserplus,html5,flash,silverlight',
          url: settings.basePath + 'plupload-handle-uploads',
          //@todo: implement settings for these
          max_file_size: '10mb',
          chunk_size: '1mb',
          unique_names: true,
          // Specify what files to browse for
          // @todo: implement via settings on the element
          //filters: [{
          //  title: "Image files",
          //  extensions: "jpg,gif,png"
          //},
          //{
          //  title: "Zip files",
          //  extensions: "zip"
          //}],
          
          // End of things needing settings.
  
          // Flash settings
          flash_swf_url: settings.plupload.libraryLocation + '/plupload/js/plupload.flash.swf',
          // Silverlight settings
          silverlight_xap_url: settings.plupload.libraryLocation + '/plupload/js/plupload.silverlight.xap'
        });
        
        // Client side form validation
        $this.closest('form').submit(function(e) {
          var uploader = $('.plupload', this).pluploadQueue();
  
          // Validate number of uploaded files
          if (uploader.total.uploaded == 0) {
            // Files in queue upload them first
            if (uploader.files.length > 0) {
              // When all files are uploaded submit form
              uploader.bind('UploadProgress',
              function() {
                if (uploader.total.uploaded == uploader.files.length) $('form').submit();
              });
  
              uploader.start();
            } else alert('You must at least upload one file.');
  
            e.preventDefault();
          }
        });
    });
  }
}

})(jQuery);