(function ($) {

    $.widget('role.b-accountList', {

        options: {
            url: ''
        },

        _create: function () {
            this.$list = this._elem('list');
            this.$addBlock = this._elem('addBlock');
            this.$popup = this._elem('popup');
            var submit = this._elem('modalresetPassword');
            this._elem('modalresetPassword').click(this._proxy(function () {
                var password = this._elem('newPassword').val();
                var data = {
                    password: password,
                    id: this._elem('modalId').val()
                };
                var _this = this;
                submit.button('loading');
                $.post(this.options.changePasswordUrl, data)
                    .always(function (res) {
                        submit.button('reset');
                        if (res.status == 'ok') {
                        	_this._delMod('error');
                            _this._setMod('success');
                            _this._elem('successMessage').text(res.data);
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
            
            this.element.on('click', '.' + this._getElemClass('changePassword'), this._proxy(function (e) {
                var target = this._elem('item').has($(e.currentTarget));
                this._showPopupEdit(target.data('id'))
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
        
        _showPopupEdit: function (id) {
            this._elem('modalId').val(id);
            this.$popup.modal('show');
        }

    });

})(jQuery)