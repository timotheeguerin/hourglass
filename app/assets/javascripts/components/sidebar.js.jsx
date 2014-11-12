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
    selectRepository: function (repository) {
        CompareViewData.setData({repository: repository});
    },
    selectFile: function (repository, page) {
        CompareViewData.setData({repository: repository, page: page});
    },
    componentDidMount: function () {
        this.compare_listener = CompareViewData.onUpdate(function (data) {
            this.setState({
                repository: data.repository,
                page: data.page
            });
            if (isDefined(data.page)) {
                this.navigateToRevisionsView();
            } else if (isDefined(data.repository)) {
                this.navigateToFilesView();
            }
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.compare_listener.destroy()
    },
    render: function () {
        return (
            <div className="sidebar">
                <RepositoriesBox user_id={this.props.user_id} onClick={this.selectRepository} />
                <FilesBox user_id={this.props.user_id} onClick={this.selectFile} repository={this.state.repository} />
                <Revisions user_id={this.props.user_id} repository={this.state.repository} page={this.state.page} />
            </div>
        );
    }
});