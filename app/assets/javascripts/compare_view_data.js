var CompareViewData = function () {
};

CompareViewData.data = {};
CompareViewData.setData = function (data) {
    $.extend(CompareViewData.data, data);
    EventManager.trigger('compare_view_data_updated', CompareViewData.data)
};

CompareViewData.onUpdate = function (callback) {
    return EventManager.trigger.apply('compare_view_data_updated', callback);
};

CompareViewData.isValid = function () {
    return !(isNull(CompareViewData.data.repository_id)
    || isNull(CompareViewData.data.page)
    || isNull(CompareViewData.data.type)
    || isNull(CompareViewData.data.left_revision_id))
};

CompareViewData.isSimpleView = function () {
    return CompareViewData.data.type === 'simple'
};

CompareViewData.isDualView = function () {
    return CompareViewData.data.type === 'dual'
};