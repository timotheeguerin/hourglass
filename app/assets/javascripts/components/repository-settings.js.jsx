/** @jsx React.DOM */
//= require global

var RepositoriesSettings = React.createClass({
    loadCommentsFromServer: function () {
        var url = Routes.list_user_repositories_path({user_id: this.props.user_id});
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
                    <h2>Repositories</h2>
                </div>
                <ol className="list">
                    {repositoryNodes}
                </ol>
            </div>
        );
    }
});

var RepositorySetting = React.createClass({
    toggleRepository: function () {
        var url;
        if (!this.state.repository.enabled) {
            url = Routes.enable_user_repository_path(current_user, this.props.repository.id);
        } else {
            url = Routes.disable_user_repository_path(current_user, this.props.repository.id);
        }

        $.post(url).done(function (data) {
            this.setState({
                processing: isDefined(data.data.processing),
                repository: data.data
            })
        }.bind(this)).fail(function (xhr, status, err) {
            console.error("Failure");
            console.error(url, status, err.toString());
        });
    },
    getInitialState: function () {
        return {
            processing: isDefined(this.props.repository.processing),
            repository: this.props.repository
        }
    },
    processingDone: function () {
        this.setState({processing: false});
        EventManager.trigger('notification', {
            type: 'success',
            title: 'Processing Completed',
            body: this.props.repository.name + ' thumbnails successfully updated'
        });
    },
    onRefresh: function () {
        $.post(Routes.refresh_user_repository_path(current_user, this.props.repository.id)).done(function (data) {
            this.setState({
                processing: isDefined(data.data.processing),
                repository: data.data

            })
        }.bind(this));
    },
    render: function () {
        var checked;
        if (this.state.repository.enabled) {
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
        var refresh_classes = React.addons.classSet({
            'fa': true,
            'fa-refresh': true,
            'fa-spin': this.state.processing
        });
        var refresh_button;
        if (this.state.repository.enabled) {
            refresh_button = (
                <i className={refresh_classes} onClick={this.onRefresh}></i>
            );
        }
        return (
            <li className="list-item">
                <div className='list-item-line'>
                    <div className='refresh-button'>
                    {refresh_button}
                    </div>
                    <div className="title full-width">
                        <h3>{this.props.repository.name}
                        </h3>
                    </div>

                    <div className="flex">
                        <small>
                            <TimeFromNow date={this.state.repository.sync_at} format='{0}'/>
                        </small>
                        <div>
                         {checked}
                        </div>
                    </div>
                </div>
                {progress}
            </li>
        );
    }
});
