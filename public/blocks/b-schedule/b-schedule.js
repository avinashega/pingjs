(function ($) {

    $.widget('role.b-schedule', {

        _create: function () {
            this.$popup = this._elem('popup');

            var submit = this._elem('modalSubmit');
            this._elem('modalSubmit').click(this._proxy(function () {
                var time = this._elem('timepicker').data('timepicker').getTime(),
                    date = this._elem('datepicker').datepicker('getDate'),
                    m = moment(moment(date).format('YYYY-MM-DD ') + time, 'YYYY-MM-DD HH:mm A').format('YYYY-MM-DD HH:mm');

                var data = {
                    date: m,
                    repost: this._elem('repost').val(),
                    id: this._elem('modalId').val(),
                    caption: this._elem('caption').val()
                };
                var _this = this;
                submit.button('loading');
                $.post(this.options.setDateUrl, data)
                    .always(function (res) {
                        submit.button('reset');
                        if (res.status == 'ok') {
                        	_this._delMod('error');
                            _this._setMod('success');
                        } else {
                        	_this._delMod('success');
                        	_this._setMod('error');
                            if (typeof res.message == 'string') {
                                _this._elem('errorMessage').text(res.message);
                            } else {
                                for (var key in res.message) {
                                    _this._elem('errorMessage').text(res.message[key]);
                                }
                            }
                        }
                    })
                    .then(this._proxy(function () {
                        this.$popup.modal('hide');
                        this._loadCurrent();
                    }))
                    .done;
            }));

            this._elem('timepicker').timepicker({
                minuteStep: 5,
                appendWidgetTo: this.$popup
            });
            this._elem('datepicker').datepicker({
                autoclose: true,
                todayHighlight: true
            });

            this._elem('item').click(this._proxy(function (e) {
                var target = $(e.currentTarget);
                this._setActive(this._getMod(target, 'type'));
                e.preventDefault()
            })).first().click();

            this.element.on('click', '.' + this._getElemClass('cancelButton'), this._proxy(function (e) {
                var i = this._elem('i').has($(e.target));
                this._cancelRequest(i.data('id'));
            }));

            this.element.on('click', '.' + this._getElemClass('removeButton'), this._proxy(function (e) {
                var i = this._elem('i').has($(e.target));
                this._removeRequest(i.data('id'));
            }));

            this.element.on('click', '.' + this._getElemClass('editButton'), this._proxy(function (e) {
                var target = this._elem('i').has($(e.currentTarget));
                this._showPopupEdit(target.data('date'), target.data('id'), target.data('caption'))
            }));

            this.element.on('click', '.' + this._getElemClass('repeatButton'), this._proxy(function (e) {
                var target = this._elem('i').has($(e.currentTarget));
                this._showPopupRepeat(target.data('date'),target.data('id'), target.data('caption'))
            }));
        },

        _setActive: function (type) {
            var $list = this._elem('list', type);

            this._setMod('type', type);
            this._elem('item').parent().removeClass('active');
            this._elem('item', 'type', type).parent().addClass('active');

            this._load($list.data('url'), $list);
        },

        _load: function (url, where) {
            where.html('');
            $.get(url)
                .then(function (res) {
                    where.html(res.data);
                })
                .done();

        },

        _loadCurrent: function () {
            var type = this._getMod('type'),
                list = this._elem('list', type);

            this._load(list.data('url'), list);
        },

        _cancelRequest: function (id) {
            $.post(this.options.cancelUrl, {id: id})
                .always(this._proxy(function () {
                    this._loadCurrent();
                }))
                .done();
        },

        _removeRequest: function (id) {
            $.post(this.options.removeUrl, {id: id})
                .always(this._proxy(function () {
                    this._loadCurrent();
                }))
                .done();
        },

        _showPopupEdit: function (d, id, caption) {
            var date = new Date(Date.parse(d));

            this._elem('modalId').val(id);
            this._elem('caption').val(caption);
            this._elem('timepicker').timepicker('setTime', date);
            this._elem('datepicker').datepicker('setValue', date);
            this._elem('repost').val(false);
            this.$popup.modal('show');
        },

        _showPopupRepeat: function (d, id, caption) {
        	var date = new Date(Date.parse(d));
            this._elem('modalId').val(id);
        	this._elem('caption').val(caption);
            this._elem('timepicker').timepicker('setTime', date);
            this._elem('datepicker').datepicker('setValue', date);
            this._elem('repost').val(true);
            this.$popup.modal('show');
        }

    });

})(jQuery);