/** @jsx React.DOM */
//= require global

var Sidebar = React.createClass({
    getInitialState: function () {
        return {};
    },
    navigateToFilesView: function () {
        $(".sidebar").animate({left: '-100%'}, 350);
    },
    navigateToRevisionsView: function () {
        $(".sidebar").animate({left: '-200%'}, 350);
    },
    selectRepository: function (id) {
        this.setState({repository_id: id});
        this.navigateToFilesView();
    },
    selectFile: function (repository_id, page_id) {
        this.setState({
            repository_id: repository_id,
            page_id: page_id
        });
        this.navigateToRevisionsView();
    },
    render: function () {
        return (
            <div className="sidebar">
                <RepositoriesBox user_id={this.props.user_id} onClick={this.selectRepository} />
                <FilesBox user_id={this.props.user_id} onClick={this.selectFile} repository_id={this.state.repository_id} />
                <Revisions user_id={this.props.user_id} repository_id={this.state.repository_id} page_id={this.state.page_id} />
            </div>
        );
    }
});