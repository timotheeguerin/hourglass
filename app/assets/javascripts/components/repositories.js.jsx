/** @jsx React.DOM */
//= require global

var RepositoriesBox = React.createClass({
    loadCommentsFromServer: function () {
        var url = Routes.list_user_repositories_path({'user_id': this.props.user_id});
        console.log("URL: " + url);
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function (comment) {
        // TODO: submit to the server and refresh the list
        log("TODO: Save the comment \"" + comment + "\" to the server");
    },
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        var pollInterval = 10000;
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, pollInterval);
    },
    navigateBack: function () {
        console.log("Navigating backwards");
        $(".sidebar").animate({left: '-100%'}, 350);
    },
    render: function () {
        var boundClick = this.props.onClick;
        var repositoryNodes = this.state.data.map(function (repository) {
            return (
                <Repository name={repository.name} id={repository.id} enabled={repository.enabled} onClick={boundClick}>
                </Repository>
            );
        });
        return (
            <div id="repositories">
                <h2 className="sidebar-nav">
                    <span className="sidebar-title">Repositories</span>
                    <span className="sidebar-button" onClick={this.navigateBack}>
                        <i className="fa fa-angle-right fa-lg" ></i>
                    </span>
                </h2>
                <ol className="repositories">
                    {repositoryNodes}
                </ol>
                <div className="search-repositories">
                    <input type="search" placeholder="Search"/>
                </div>
            </div>
        );
    }
});

var Repository = React.createClass({
    toggleRepository: function(e) {
        var id = this.props.id;
        console.log("Enabling repository with id " + id);
        if (e.target.checked) {
            console.log('e is checked');
            url = Routes.enable_user_repository_path(current_user, id);
        } else {
            console.log('e is NOT checked');
            url = Routes.disable_user_repository_path(current_user, id);
        }

        $.post(url).done(function(data) {
            console.log("Great succuss");
        }).fail(function (xhr, status, err) {
            console.log("Failure");
            console.error(this.props.url, status, err.toString());
        });
    },
    selectRepository: function () {
        console.log("Repository clicked with id: " + this.props.id);
        //console.log("Selecting repository " + this.props.id);
        //console.log("Navigating backwards");
        //$(".sidebar").animate({left: '-100%'}, 350);
        this.props.onClick(this.props.id);
    },
    render: function () {
        if (this.props.enabled) {
            return (
                <li className="repository" onClick={this.selectRepository}>
                {this.props.name}
                    <div class="right">
                        <input type="checkbox" defaultChecked onChange={this.toggleRepository} />
                        <i className="fa fa-angle-right fa-lg"></i>
                    </div>
                </li>
            );
        }
        return (
            <li className="repository" onClick={this.selectRepository}>
                {this.props.name}
                <div class="right">
                    <input type="checkbox" onChange={this.toggleRepository} />
                    <i className="fa fa-angle-right fa-lg"></i>
                </div>
            </li>
        );
    }
});

$(document).ready(function () {
    //React.renderComponent(
    //    <RepositoriesBox url={Routes.list_user_repositories_path({'user_id': current_user})} pollInterval={5000} />,
    //    document.getElementById('repositories')
    //);
});
