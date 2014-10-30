/** @jsx React.DOM */
//= require global

var Sidebar = React.createClass({
    loadFilesFromServer: function () {
    },
    getInitialState: function () {
        return {};
    },
    navigateBack: function () {
        console.log("Navigating backwards");
        $(".sidebar").animate({left: '-100%'}, 350);
    },
    selectRepository: function (id) {
        console.log("Sidebar is selecting repository with id: " + id);
        this.setState({current_repository_id: id});
        this.navigateBack();
    },
    render: function () {
        console.log("Current user id: " + this.props.user_id);
        return (
            <div className="sidebar">
                <RepositoriesBox user_id={this.props.user_id} onClick={this.selectRepository}/>
                <FilesBox user_id={this.props.user_id} repository_id={this.state.current_repository_id}/>
            </div>
        );
    }
});