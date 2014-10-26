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
        var pollInterval = 10000;
        this.loadFilesFromServer();
        setInterval(this.loadFilesFromServer, pollInterval);
    },
    navigateBack: function () {
        console.log("Navigating backwards");
        $(".all-repositories").animate({left: '-100%'}, 350);
        $(".all-files").animate({left: '-100%'}, 350);
    },
    render: function () {
        var fileNodes = this.state.data.map(function (file) {
            return (
                <Repository name={file.name} id={file.id}>
                </Repository>
            );
        });
        return (
            <div id="files">
                <h2 className="sidebar-nav" onClick={this.navigateBack}>
                    <i className="fa fa-angle-left fa-lg"></i>
                Files
                </h2>
                <ol className="files">
                    {fileNodes}
                </ol>
            </div>
        );
    }
});

var Repository = React.createClass({
    toggleRepository: function (e) {
        var id = this.props.id;
        console.log("Enabling repository with id " + id);
        var url = Routes.enable_user_repository_path(current_user, id);
        if (e.checked) {
            console.log('e is checked');
        } else {
            console.log('e is NOT checked');
        }

        $.post(url).done(function (data) {
            console.log("Great succuss");
        }).fail(function (xhr, status, err) {
            console.log("Failure");
            console.error(this.props.url, status, err.toString());
        });
    },
    render: function () {
        return (
            <li className="repository">
            Bla bla: {this.props.name}
                <div class="right">
                    <input type="checkbox" checked='' onChange={this.toggleRepository} />
                    <i className="fa fa-angle-right fa-lg"></i>
                </div>
            </li>
        );
    }
});
console.log(current_user);
console.log(window.current_user);

$(document).ready(function () {
    //React.renderComponent(
    //    <RepositoriesBox url={Routes.list_user_repositories_path({'user_id': current_user})} pollInterval={5000} />,
    //    document.getElementById('repositories')
    //);
});
