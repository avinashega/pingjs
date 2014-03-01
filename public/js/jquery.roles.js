(function ($) {

    var roles = {
        inited:[]
    };

    // TODO: init roles from argument

    $.fn.roles = function () {

        var roles_list = [],
            require_list = [],
            $role_blocks = this.find('[role]').add(this.filter('[role]'));

        $role_blocks.each(function () {
            var role = $(this).attr('role');
            if ($.inArray(role, roles_list) < 0) {
                roles_list.push(role);
            }
        });


        $.each(roles_list, function (index, role) {
            var blockList, blockParams,
                blockIndex, blockLength;

            if (typeof $.fn[role] == 'function') {

                blockList = $role_blocks.filter('[role=' + role + ']');

                for (blockIndex = 0, blockLength = blockList.length; blockIndex < blockLength; blockIndex++) {
                    blockParams = (blockList.get(blockIndex).onclick || $.noop)();
                    $(blockList.get(blockIndex))[role](blockParams);
                }

                roles.inited.push(role);
            }
        });

        return this;
    };

    return roles;
})(jQuery);