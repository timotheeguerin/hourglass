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
    componentDidMount: function () {
        this.compare_listener = CompareViewData.onUpdate(function (data) {
            if (!isNull(data.page)) {
                this.selectFile(data.repository.id, data.page.id)
            } else if (!isNull(data.repository_id)) {
                this.selectRepository(data.repository.id)
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
                <FilesBox user_id={this.props.user_id} onClick={this.selectFile} repository_id={this.state.repository_id} />
                <Revisions user_id={this.props.user_id} repository_id={this.state.repository_id} page_id={this.state.page_id} />
            </div>
        );
    }
});