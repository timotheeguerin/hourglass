var CompareViewData = function () {
};

CompareViewData.data = {};
CompareViewData.reset_data = {repository: ['page'], page: ['left_revision', 'right_revision']};
CompareViewData.setData = function (data) {
    if (data.type == 'simple') {
        delete data.dual_type;
        delete CompareViewData.data.dual_type;
        delete CompareViewData.data.right_revision;
    }
    for (var key in CompareViewData.reset_data) {
        if (isDefined(data[key]) && data[key] !== CompareViewData.data[key]) {
            for (var i in CompareViewData.reset_data[key]) {
                var delete_key = CompareViewData.reset_data[key][i];
                delete CompareViewData.data[delete_key];
            }
        }
    }

    $.extend(CompareViewData.data, data);
    EventManager.trigger('compare_view_data_updated', CompareViewData.data)
};

CompareViewData.onUpdate = function (callback) {
    return EventManager.on('compare_view_data_updated', callback);
};

CompareViewData.isValid = function () {
    return !(isNull(CompareViewData.data.repository)
    || isNull(CompareViewData.data.page)
    || isNull(CompareViewData.data.type)
    || isNull(CompareViewData.data.left_revision))
};

CompareViewData.isSimpleView = function () {
    return CompareViewData.data.type === 'simple'
};

CompareViewData.isDualView = function () {
    return CompareViewData.data.type === 'dual'
};