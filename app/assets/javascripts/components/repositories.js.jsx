/** @jsx React.DOM */
//= require global

var RepositoriesBox = React.createClass({
    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
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
        console.log("URL: " + this.props.url);
        //this.setState({data: data});
        this.loadCommentsFromServer();
        //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            <div>

                <RepositoriesList data={this.state.data} />
            </div>
        );
    }
});

var RepositoriesList = React.createClass({
    render: function () {
        var repositoryNodes = this.props.data.map(function (repository) {
            return (
                <Repository name={repository.name}>
                </Repository>
            );
        });
        return (
            <div className="repositories">
                <h2>Repositories</h2>
{repositoryNodes}
            </div>
        );
    }
});

var Repository = React.createClass({
    render: function () {
        return (
            <div className="repository">
    {this.props.name}
                <input type="checkbox" />
            </div>
        );
    }
});
console.log(current_user);
console.log(window.current_user);

$(document).ready(function () {
    React.renderComponent(
        <RepositoriesBox url={Routes.list_user_repositories_path({'user_id': current_user})} />,
        document.getElementById('repositories')
    );
});
