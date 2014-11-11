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
