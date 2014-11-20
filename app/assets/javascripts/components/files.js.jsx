/** @jsx React.DOM */
//= require global

var FilesBox = React.createClass({
    loadFilesFromServer: function (repository) {
        if (isNull(repository)) {
            return;
        }
        var url = Routes.list_user_repository_pages_path(current_user, repository.id);
        $.get(url).success(function (data) {
            this.setState({data: data});
            this.props.onFilesLoaded();
        }.bind(this)).fail(function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this))
    },
    getInitialState: function () {
        return {data: [], searchText: ''};
    },
    getDefaultProps: function () {
        return {
            onFilesLoaded: function () {
            }
        }
    },
    getVisiblePages: function () {
        return this.state.data.filter(function (page) {
            return page.path.indexOf(this.state.searchText) > -1;
        }.bind(this));
    },
    componentWillMount: function () {
        this.loadFilesFromServer(this.props.repository);
    },
    shouldComponentUpdate: function (nextProps) {
        if (nextProps.repository != this.props.repository) {
            this.loadFilesFromServer(nextProps.repository);
            return false;
        }
        return true;
    },
    navigateBack: function () {
        $(".sidebar").animate({left: '0'}, 350);
    },
    hideSidebar: function () {
        var animationSpeed = 300;
        $(".sidebar-container").toggleClass('hidden-container', animationSpeed);
        $("#content").toggleClass('wide-content', animationSpeed);
    },
    search: function (event) {
        this.setState({searchText: event.target.value});
    },
    render: function () {
        var boundClick = this.props.onClick;
        var fileNodes = this.getVisiblePages().map(function (file) {
            return (
                <Page key={file.id} name={file.name} file={file} repository={this.props.repository} onClick={boundClick}>
                </Page>
            );
        }.bind(this));
        return (
            <div id="files" className="sidebar-column">
                <h2 className="sidebar-nav">
                    <i className="fa fa-angle-left fa-lg" id="fileBackwardButton" onClick={this.navigateBack}></i>
                    <span className="sidebar-title">Pages</span>
                    <span className="sidebar-button">

                    </span>
                </h2>
                <ol className="files sidebar-content">
                    {fileNodes}
                </ol>
                <div className="search-repositories">
                    <input type="search" placeholder="Search pages" onChange={this.search}/>
                </div>
            </div>
        );
    }
});

var Page = React.createClass({
    selectFile: function () {
        this.props.onClick(this.props.repository, this.props.file);
    },
    render: function () {
        var image = this.props.file.revisions[0].thumbnails;
        return (
            <div className="thumbnail" onClick={this.selectFile}>
                <div className="scroll-container" draggable="false">
                    <img src={image} />
                </div>
                <span className="thumbnail-title">{this.props.name}</span>
            </div>
        );
    }
});
