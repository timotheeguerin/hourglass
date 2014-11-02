/** @jsx React.DOM */
//= require components/repository_progress_bar
//= require global

var RepositoriesSettings = React.createClass({
    loadCommentsFromServer: function () {
        var url = Routes.list_user_repositories_path({user_id: this.props.user_id});
        console.log("URL: " + url);
        $.get(url).success(function (data) {
            this.setState({data: data});
        }.bind(this)).fail(function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this));
    },
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
    },
    render: function () {
        var repositoryNodes = this.state.data.map(function (repository) {
            return (
                <RepositorySetting name={repository.name} id={repository.id} enabled={repository.enabled}>
                </RepositorySetting>
            );
        });
        return (
            <div className="repositories-settings">
                <div className="section-header">
                    <span className="sidebar-button">
                        <i className="fa fa-plus fa-lg" ></i>
                    </span>
                    <h2>Repositories</h2>
                    <span className="sidebar-button">
                        <i className="fa fa-close fa-lg" ></i>
                    </span>
                </div>
                <ol className="list">
                    {repositoryNodes}
                </ol>
            </div>
        );
    }
});

var RepositorySetting = React.createClass({
    toggleRepository: function (e) {
        var url;
        if (e.target.checked) {
            url = Routes.enable_user_repository_path(current_user, this.props.id);
        } else {
            url = Routes.disable_user_repository_path(current_user, this.props.id);
        }

        $.post(url).done(function (data) {
            console.log("Great succuss");
        }).fail(function (xhr, status, err) {
            console.log("Failure");
            console.error(url, status, err.toString());
        });
    },
    render: function () {
        var checked;
        if (this.props.enabled) {
            checked = <input type="checkbox" defaultChecked onChange={this.toggleRepository} />;
        } else {
            checked = <input type="checkbox" onChange={this.toggleRepository} />;
        }

        var progress;
        var isInProgress = this.props.enabled;
        if (isInProgress) {
            progress = <RepositoryProgressBar repository_id={this.props.id}/>;
        } else {
            progress = null;
        }
        return (
            <li className="list-item" onClick={this.selectRepository}>
                <div className="flex">
                    <div className="full-width">
                        <h3>{this.props.name} -
                            <small> Updated 3 days ago</small>
                        </h3>
                    </div>
                    <div>
                        {checked}
                    </div>
                </div>
                {progress}
            </li>
        );
    }
});
