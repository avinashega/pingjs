(function ($) {

    $.widget('role.b-photo', {
        _create: function () {
            this.$img = this._elem('img');
            this._elem('timepicker').timepicker({
                minuteStep: 5,
                showMeridian: false
            });
            this._elem('datepicker').datepicker({
                autoclose: true,
                todayHighlight: true
            });
            this._elem('datepicker').datepicker('setValue', new Date);

            this.element.on('b-uploadform:success', this._proxy(function (e, url) {
                this._setSrc(url);
            }));

            this._elem('cancelButton').click(this._proxy(function () {
                this._cancel();
            }));

            this._elem('resetButton').click(this._proxy(function () {
                this._setSrc(this.$img.data('url'));
            }));

            this.element.on('b-aviary:update', this._proxy(function () {
                this._setMod('post');
                this._delMod('error');
            }));

            this._elem('postButton').click(this._proxy(function () {
                this._postPhoto(false);
            }));
            this._elem('postButtonNow').click(this._proxy(function () {
                this._postPhoto(true);
            }));
        },

        _cancel: function () {
            this._delMod('img');
            this._delMod('post');
            this.$img.attr('src', '');
        },

        _setSrc: function (url) {
            this.$img.attr('src', url);
            this.$img.data('url', url);

            this._delMod('post');
            this._delMod('error');
            this._delMod('success');
            this._setMod('img');

            this._elem('img').trigger('b-aviary:open');
        },

        _postPhoto: function (isNow) {
            var data = {},
                _this = this,

                failCb = function (message) {
                    _this._setMod('error');
                    if (typeof message == 'string') {
                        _this._elem('errorMessage').text(message);
                    } else {
                        for (var key in message) {
                            _this._elem('errorMessage').text(message[key]);
                        }
                    }
                };

            if (this._hasMod('posting')) {
                return false;
            }

            data.accountIds = $('.b-accountList')['b-accountList']('getActiveIds').join(',');
            data.src = this.$img.attr('src');

            var time = this._elem('timepicker').data('timepicker').getTime(),
                date = this._elem('datepicker').datepicker('getDate');
                mFormat = moment(moment(date).format('YYYY-MM-DD ') + time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
                m = moment(moment(date).format('YYYY-MM-DD ') + time, 'YYYY-MM-DD HH:mm');
                console.log(mFormat);
                console.log(m);

            data.when = m.isValid() && !isNow ? mFormat : 0;
            data.caption = this._elem('caption').val();
            data.notification = this._elem('notification').is(':checked');

            this._setMod('posting');
            this._delMod('error');
            this._delMod('success');
            this._elem(isNow ? 'postButtonNow' : 'postButton').button('loading');
            _this._elem('postButton').attr('disabled', true);
            _this._elem('postButtonNow').attr('disabled', true);

            $.post(this.options.url, data)
                .fail(function () {
                    failCb('System error');
                })
                .always(function () {
                    _this._delMod('posting');
                    _this._elem('postButton').button('reset');
                    _this._elem('postButtonNow').button('reset');

                    _this._elem('postButton').attr('disabled', false);
                    _this._elem('postButtonNow').attr('disabled', false);
                })
                .done(function (res) {
                    if (res.status == 'ok') {
                        _this._delMod('img');
                        _this._delMod('post');
                        _this.$img.attr('src', '');
                        _this._setMod('success');
                    } else {
                        failCb(res.message);
                    }
                });
        }
    });

})(jQuery);