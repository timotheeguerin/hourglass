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
    console.log($(iframe1.contents()));
    $(iframe1.contents()).scroll(function () {
        scrollTop = $(this).scrollTop();
        updateScroll(iframe2)
    });
    $(iframe2.contents()).scroll(function () {
        scrollTop = $(this).scrollTop();
        updateScroll(iframe1)
    })
}
