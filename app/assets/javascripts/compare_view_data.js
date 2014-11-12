var CompareViewData = function () {
};

CompareViewData.data = {};
CompareViewData.setData = function (data) {
    if (data.type == 'simple') {
        delete data.dual_type;
        delete CompareViewData.data.dual_type;
        delete CompareViewData.data.right_revision;
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