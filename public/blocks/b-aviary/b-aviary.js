(function ($) {

    $.widget('role.b-aviary', {

        _create: function () {
            var _this = this;

            var featherEditor = new Aviary.Feather({
                apiKey: '04988556c2528a49',
                apiVersion: 3,
                theme: 'light',
                tool: 'all',
                fileFormat: 'jpg',
                onSave: function (imageID, newURL) {
                    _this.element.attr('src', newURL);
                    _this._trigger(':update', {}, newURL);
                    featherEditor.close();
                },
                onError: function (errorObj) {
                    console.log('error ', errorObj);
                    alert(errorObj.message);
                },
                cropPresets: [
                    ['Instagram picture', '1:1']
                ]
            });

            this.element.click(this._proxy(function () {
                featherEditor.launch({
                    image: this.element.get(0),
                    noCloseButton: false,
                    initTool: 'effects'
                });
            }));

            this.element.on('b-aviary:open', this._proxy(function () {
                featherEditor.launch({
                    image: this.element.get(0),
                    noCloseButton: false,
                    forceCropPreset: ['Instagram Post', '1:1'],
                    forceCropMessage: 'Please crop your picture:',
                    displayImageSize: true,
                    maxSize: 1280
                });
            }));
        }

    });

})(jQuery);