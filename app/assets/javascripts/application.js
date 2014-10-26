// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require js-routes
//= require react
//= require react_ujs
//= require_tree .


//noinspection SillyAssignmentJS
React = React;


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
        move_slider(e.pageX);
    });
});

var move_slider = function (position) {
    $('.slider.dragging').each(function () {
        var parent = $(this).parent();
        var left_iframe = parent.find('.left-iframe')
        if (position >= parent.offset().left && position <= parent.offset().left + parent.width()) {
            $(this).offset({left: position})
            left_iframe.css({width: position - parent.offset().left})
            left_iframe.find('iframe').css({width: parent.width()})
        }

    });
};