/** @jsx React.DOM */
//= require global

var Revisions = React.createClass({
    loadRevisionsFromServer: function (repository, page) {
        if (isNull(repository) || isNull(page)) {
            return;
        }
        var url = Routes.list_user_repository_revisions_path(current_user, repository.id, {page_id: page.id});
        $.get(url).success(function (data) {
            this.setState({data: data});
        }.bind(this)).fail(function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this))
    },
    getInitialState: function () {
        return {data: []};
    },
    componentWillMount: function () {
        this.loadRevisionsFromServer(this.props.repository, this.props.page);
    },
    shouldComponentUpdate: function (nextProps) {
        if (nextProps.repository !== this.props.repository || nextProps.page !== this.props.page) {
            this.loadRevisionsFromServer(nextProps.repository, nextProps.page);
            return false;
        }
        return true;
    },
    navigateBack: function () {
        $(".sidebar").animate({left: '-100%'}, 350);
    },
    hideSidebar: function () {
        var animationSpeed = 300;
        $(".sidebar-container").toggleClass('hidden-container', animationSpeed);
        $("#content").toggleClass('wide-content', animationSpeed);
    },
    render: function () {
        var fileNodes = this.state.data.map(function (revision) {
            return (
                <Revision key={revision.id}  revision={revision}>
                </Revision>
            );
        });
        return (
            <div id="revisions" className="sidebar-column">
                <h2 className="sidebar-nav">
                    <i className="fa fa-angle-left fa-lg" id="fileBackwardButton" onClick={this.navigateBack}></i>
                    <span className="sidebar-title">Revisions</span>
                    <span className="sidebar-button">

                    </span>
                </h2>
                <ol className="files sidebar-content">
                    {fileNodes}
                </ol>
                <div className="search-repositories">
                    <input type="search" placeholder="Search"/>
                </div>
            </div>
        );
    }
});

var Revision = React.createClass({
    dragStart: function (e) {
        e.dataTransfer.setData("revision", JSON.stringify(this.props.revision));
        EventManager.trigger('dragging_revision', true);
    },
    render: function () {
        var image = this.props.revision.pages[0].thumbnails;
        return (
            <div className="thumbnail" draggable="true" onDragStart={this.dragStart}>
                <div className="scroll-container" draggable="false">
                    <img src={image} draggable="false"/>
                </div>
                <span className="thumbnail-title revision-title">
                    <span className="nowrap" title={this.props.revision.message}>{this.props.revision.message}</span>
                    <br/>
                    <span className="light" title={this.props.revision.date}>
                        <TimeFromNow date={this.props.revision.date} format='{0}'/>
                    </span>
                </span>
            </div>
        );
    }
});

$(document).on('dragend', function () {
    EventManager.trigger('dragging_revision', false);
});