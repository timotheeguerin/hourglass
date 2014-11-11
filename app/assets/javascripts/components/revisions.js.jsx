/** @jsx React.DOM */
//= require global

var Revisions = React.createClass({
    loadRevisionsFromServer: function (repository_id, page_id) {
        if (isNull(repository_id)) {
            return;
        }
        var url = Routes.list_user_repository_revisions_path(current_user, repository_id, {page_id: page_id});
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
        this.loadRevisionsFromServer(this.props.repository_id, this.props.page_id);
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        if (nextProps.repository_id != this.props.repository_id || nextProps.page_id != this.props.page_id) {
            this.loadRevisionsFromServer(nextProps.repository_id, nextProps.page_id);
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
                <Revision revision={revision} id={revision.id} image={revision.pages[0].thumbnails}>
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
    drag: function (ev) {
        console.log("Handling drag start event: " + event);
        ev.dataTransfer.setData("revision", JSON.stringify(this.props.revision));
        EventManager.trigger('dragging_revision', true)
    },
    render: function () {
        return (
            <div className="thumbnail" draggable="true" onDragStart={this.drag}>
                <div className="scroll-container" draggable="false">
                    <img src={this.props.image} />
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
