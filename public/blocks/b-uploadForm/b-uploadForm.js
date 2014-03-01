(function ($) {

    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    $.widget('role.b-uploadForm', {

        _create: function () {
            this.$submitButton = this._elem('submitButton');
            this.$button = this._elem('button');

            this.element.fileupload({
                dataType: 'json',
                autoUpload: true,
                dropZone: this.element,
                add: this._proxy(function (e, data) {
                    this._disableUpload(true);
                    this._delMod('error');
                    this._setMod('uploading');
                    data.submit();
                }),
                done: this._proxy(function (e, data) {
                    var resp = data.result;

                    if (resp.status == 'ok') {
                        this._trigger(':success', {}, resp.data);
                    } else if (resp.status == 'error') {
                        this._setMod('error');
                        this._elem('errorMessage').text(resp.message);
                    }
                }),
                fail: this._proxy(function(){
                    this._setMod('error');
                    this._elem('errorMessage').text('Upload error');
                }),
                always: this._proxy(function(){
                    this._delMod('uploading');
                    this._disableUpload(false);
                })
            });

        },

        _disableUpload: function (dis) {
            this.$submitButton.attr('disabled', dis);
            this.$button.attr('disabled', dis);


        }

    });

})(jQuery);