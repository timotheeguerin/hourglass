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
        $("#repositories").animate({left: '-100%'}, 350);
    },
    render: function () {
        return (
            <div id="repositories">
                <h2 className="sidebar-nav" onClick={this.navigateBack}>
                    <i className="fa fa-angle-left fa-lg"></i>
                Repositories</h2>
                <RepositoriesList data={this.state.data} />
            </div>
        );
    }
});

var RepositoriesList = React.createClass({
    render: function () {
        var repositoryNodes = this.props.data.map(function (repository) {
            return (
                <Repository name={repository.name} id={repository.id} enabled={repository.enabled}>
                </Repository>
            );
        });
        return (
            <ol className="repositories">
                {repositoryNodes}
            </ol>
        );
    }
});

var Repository = React.createClass({
    toggleRepository: function(e) {
        var id = this.props.id;
        console.log("Enabling repository with id " + id);
        var url = Routes.enable_user_repository_path(current_user, id);
        if (e.checked) {
            console.log('e is checked');
        } else {
            console.log('e is NOT checked');
        }

        $.post(url).done(function(data) {
            console.log("Great succuss");
        }).fail(function (xhr, status, err) {
            console.log("Failure");
            console.error(this.props.url, status, err.toString());
        });
    },
    render: function () {
        if (this.props.enabled) {
            return (
                <li className="repository">
                {this.props.name}
                    <div class="right">
                        <input type="checkbox" checked='checked' onChange={this.toggleRepository} />
                        <i className="fa fa-angle-right fa-lg"></i>
                    </div>
                </li>
            );
        }
        return (
            <li className="repository">
                {this.props.name}
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
