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
                <RepositorySetting repository={repository}>
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
        if (!this.state.enabled) {
            url = Routes.enable_user_repository_path(current_user, this.props.repository.id);
        } else {
            url = Routes.disable_user_repository_path(current_user, this.props.repository.id);
        }
        this.setState({
            enabled: !this.state.enabled,
            processing: (this.state.processing || !this.state.enabled)
        });

        $.post(url).done(function (data) {
            console.log("Great succuss");
        }).fail(function (xhr, status, err) {
            console.error("Failure");
            console.error(url, status, err.toString());
        });
    },
    getInitialState: function () {
        return {
            enabled: this.props.repository.enabled,
            processing: this.props.repository.processing != 0
        }
    },
    processingDone: function () {
        this.setState({processing: false});
        EventManager.trigger('notification', {
            id: Math.random(),
            type: 'success',
            title: 'Processing Completed',
            body: 'Finished processing thumbnails for ' + this.props.repository.name
        });
    },
    render: function () {
        var checked;
        if (this.state.enabled) {
            checked = <input type="checkbox" defaultChecked onChange={this.toggleRepository} />;
        } else {
            checked = <input type="checkbox" onChange={this.toggleRepository} />;
        }

        var progress;
        if (this.state.processing) {
            progress = <RepositoryProgressBar repository_id={this.props.repository.id} onDone={this.processingDone}/>;
        } else {
            progress = null;
        }
        return (
            <li className="list-item" onClick={this.selectRepository}>
                <div className="flex">
                    <div className="full-width">
                        <h3>{this.props.repository.name}
                        </h3>
                    </div>
                    <small>3 days ago</small>
                    <div>
                         {checked}
                    </div>
                </div>
                {progress}
            </li>
        );
    }
});
