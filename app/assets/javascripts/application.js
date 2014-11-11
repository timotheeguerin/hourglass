//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require js-routes
//= require react
//= require react_ujs
//= require moment
//= require websocket_rails/main
//= require helper
//= require events
//= require compare_view_data
//= require_tree .

//noinspection SillyAssignmentJS
React = React;
//noinspection SillyAssignmentJS
Routes = Routes;
//noinspection SillyAssignmentJS
current_user = current_user;

//noinspection BadExpressionStatementJS
(function () {
    this.getInitialState();
    this.componentDidMount();
    this.componentWillUnmount();
    this.componentWillReceiveProps();
    this.getDefaultProps();
});


function link_iframes(iframe1, iframe2) {
    var scrollTop = 0;

    function updateScroll(iframe) {
        $(iframe.contents()).scrollTop(scrollTop);
    }

    $(iframe1.contents()).scroll(function () {
        scrollTop = $(this).scrollTop();
        updateScroll(iframe2)
    });
    $(iframe2.contents()).scroll(function () {
        scrollTop = $(this).scrollTop();
        updateScroll(iframe1)
    })
}

$(document).ready(function () {
    $(document).on('mousedown', '.slider', function (e) {
        $(this).addClass('dragging');
    });

    $(document).on('mouseup', function (e) {
        $('.slider.dragging').removeClass('dragging');
    });


    $(document).mousemove(function (e) {
        move_sliders(e.pageX);
    });
});

var move_sliders = function (position) {
    $('.slider.dragging').each(function () {
        move_slider($(this), position)
    });
};

var init_sliders = function () {
    $('.slider').each(function () {
        move_slider($(this))
    });
};


var move_slider = function (slider, position) {
    var parent = slider.parent();
    var left_iframe = parent.find('.left-iframe');
    left_iframe.find('iframe').css({width: parent.width()});
    if (!isNull(position) && position >= parent.offset().left && position <= parent.offset().left + parent.width()) {
        slider.offset({left: position});
        left_iframe.css({width: position - parent.offset().left});
    }
};