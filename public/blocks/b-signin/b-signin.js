(function ($) {

    $.widget('role.b-signin', {
    	
    	_getParam: function(name){
    		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    	    results = regex.exec(location.search);
    	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    	},

        _create: function () {
            this.$popup = this._elem('popup');
            this.$resetpopup = this._elem('resetpopup');
            var submit = this._elem('modalSubmitPassword');
            var usernameSubmit = this._elem('modalSubmitUsername');
            var resetPassword = this._elem('modalresetPassword');
            this._elem('modalSubmitPassword').click(this._proxy(function () {
                var email = this._elem('email').val();
                var data = {
                    email: email
                };
                var _this = this;
                submit.button('loading');
                $.post(this.options.forgotPasswordUrl, data)
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
            
            this._elem('modalSubmitUsername').click(this._proxy(function () {
                var email = this._elem('email').val();
                var data = {
                    email: email
                };
                var _this = this;
                usernameSubmit.button('loading');
                $.post(this.options.forgotUsernameUrl, data)
                    .always(function (res) {
                    	usernameSubmit.button('reset');
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
            
            this._elem('modalresetPassword').click(this._proxy(function () {
                var password = this._elem('newPassword').val();
                var repeatPassword = this._elem('repeatNewPassword').val();
                var token = this._getParam('token');
                var data = {
                    newPassword: password,
                    repeatNewPassword: repeatPassword,
                    token: token
                };
                var _this = this;
                resetPassword.button('loading');
                $.post(this.options.resetPasswordUrl, data)
                    .always(function (res) {
                    	resetPassword.button('reset');
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
                        this.$resetpopup.modal('hide');
                    }))
                    .done;
            }));
            
            this._elem('item').click(this._proxy(function (e) {
                var target = $(e.currentTarget);
                this._setActive(this._getMod(target, 'type'));
                e.preventDefault()
            })).first().click();


            this.element.on('click', '.' + this._getElemClass('forgotButton'), this._proxy(function (e) {
                var target = this._elem('i').has($(e.currentTarget));
                this._showPopup()
            }));
        },

        _showPopup: function () {
            this.$popup.modal('show');
        }

    });

})(jQuery);