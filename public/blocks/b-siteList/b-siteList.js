(function ($) {

    $.widget('role.b-siteList', {

        options: {
            url: ''
        },

        _create: function () {
            this.$list = this._elem('list');
            this.$addBlock = this._elem('addBlock');
            this.$popup = this._elem('popup');
            
            var submit = this._elem('modalSubmit');
            this._elem('modalSubmit').click(this._proxy(function () {
                var data = {
                    id: this._elem('modalId').val(),
                    protocol: this._elem('protocol').val(),
                    url: this._elem('url').val(),
                    port: this._elem('port').val(),
                    frequency: this._elem('frequency').val(),
                    responsiveness: this._elem('responsiveness').val()
                };
                var _this = this;
                submit.button('loading');
                $.post(this.options.editSiteUrl, data)
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
            
            this._elem('addButton').click(this._proxy(function () {
                this._setMod(this.$addBlock, 'open');
            }));
            this._elem('cancelButton').click(this._proxy(function () {
                this._delMod(this.$addBlock, 'open');
            }));

            this.element.on('click', '.' + this._getElemClass('removeButton'), this._proxy(function (e) {
                this._removeItem(this._getItems().has(e.currentTarget).data('id'));
                e.stopPropagation();
            }));

            this.element.on('b-ajaxform:success', this._proxy(function () {
                this.element.find('form')['b-ajaxForm']('reset');
                this._reload();
            }));
            this._reload();

            this.element.on('click', '.' + this._getElemClass('item'), this._proxy(function (e) {
                var target = $(e.currentTarget);
                e.preventDefault();

                target.toggleClass('active');
            }));
            
            this.element.on('click', '.' + this._getElemClass('editButton'), this._proxy(function (e) {
                var target = this._elem('item').has($(e.currentTarget));
                this._showPopupEdit(target.data('id'), target.data('protocol'), target.data('url'), target.data('port'), target.data('path'),target.data('frequency'), target.data('responsiveness'))
            }));
        },

        _reload: function () {
            var _this = this;
            $.get(this.options.url)
                .then(function (resp) {
                    _this.$list.html(resp.data);
                })
                .done();
        },

        _removeItem: function (id) {
            var _this = this;
            $.post(this.options.removeUrl, {id: id})
                .then(function () {
                    _this._reload();
                })
                .done();
        },

        _getItems: function () {
            return this._elem('item');
        },

        getActiveIds: function () {
            var ids = [];
            this._elem('item').filter('.active').each(function () {
                ids.push($(this).data('id'));
            });

            
            return ids;
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
            var list = this._elem('list');

            this._load('/manageSites/list', list);
        },
        
        _showPopupEdit: function (id, protocol, url, port, path, frequency, responsiveness) {
            this._elem('modalId').val(id);
            this._elem('protocol').val(protocol);
            this._elem('url').val(url);
            this._elem('port').val(port);
            this._elem('path').val(path);
            this._elem('frequency').val(frequency);
            this._elem('responsiveness').val(responsiveness);
            this.$popup.modal('show');
        }

    });

})(jQuery)