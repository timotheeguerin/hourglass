/** @jsx React.DOM */
//= require global

var FilesBox = React.createClass({
    loadFilesFromServer: function () {
        var id = this.props.repository_id;
        var url = Routes.list_user_repository_pages_path(current_user, id);
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                this.setState({data: data});
                if (data.length) {
                    console.log("No files found in repository");
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        var pollInterval = 1000;
        this.loadFilesFromServer();
        //setInterval(this.loadFilesFromServer, pollInterval);
    },
    navigateBack: function () {
        console.log("Navigating backwards");
        $(".sidebar").animate({left: '0'}, 350);
    },
    hideSidebar: function () {
        console.log("Hiding Sidebar");
        var animationSpeed = 300;
        $(".sidebar-container").toggleClass('hidden-container', animationSpeed);
        $("#content").toggleClass('wide-content', animationSpeed);
    },
    render: function () {
        var fileNodes = this.state.data.map(function (file) {
            return (
                <File name={file.name} id={file.id} image={file.revisions[0].thumbnails}>
                </File>
            );
        });
        return (
            <div id="files">
                <h2 className="sidebar-nav">
                    <i className="fa fa-angle-left fa-lg" id="fileBackwardButton" onClick={this.navigateBack}></i>
                    <span className="sidebar-title">Files</span>
                    <span className="sidebar-button">

                    </span>
                </h2>
                <ol className="files">
                    {fileNodes}
                </ol>
                <div className="search-repositories">
                    <input type="search" placeholder="Search"/>
                </div>
            </div>
        );
    }
});

var File = React.createClass({
    render: function () {
        return (
            <div className="thumbnail" draggable="true">
                <div className="scroll-container" draggable="false">
                    <img src={this.props.image} />
                </div>
                <span className="thumbnail-title">{this.props.name}</span>
            </div>
        );
    }
});
