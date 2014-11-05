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
        if (!this.state.repository.enabled) {
            url = Routes.enable_user_repository_path(current_user, this.props.repository.id);
        } else {
            url = Routes.disable_user_repository_path(current_user, this.props.repository.id);
        }

        $.post(url).done(function (data) {
            this.setState({
                processing: !isNull(data.data.processing),
                repository: data.data

            })
        }.bind(this)).fail(function (xhr, status, err) {
            console.error("Failure");
            console.error(url, status, err.toString());
        });
    },
    getInitialState: function () {
        return {
            processing: !isNull(this.props.repository.processing),
            repository: this.props.repository
        }
    },
    processingDone: function () {
        this.setState({processing: false});
        EventManager.trigger('notification', {
            type: 'success',
            title: 'Processing Completed',
            body: 'Finished processing thumbnails for ' + this.props.repository.name
        });
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
        return (
            <li className="list-item">
                <div className="flex">
                    <div className="full-width">
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

var TimeFromNow = React.createClass({
    getDefaultProps: function () {
        return {
            format: '{0}'
        };
    },
    getInitialState: function () {
        return {
            date: this.getFromTime(this.props.date)
        }
    },
    updateTime: function (date) {
        if (isNull(date)) {
            date = this.props.date;
        }
        this.setState({
            date: this.getFromTime(date)
        })
    },
    getFromTime: function (date) {
        if (isNull(date)) {
            return null;
        } else {
            return moment.utc(date, "YYYY-MM-DD hh:mm:ss").fromNow()
        }
    },
    componentDidMount: function () {
        this.tick();
    },
    tick: function () {
        if (!isNull(this.ticker)) {
            clearInterval(this.ticker);
        }
        this.ticker = setInterval(this.updateTime, 60000);
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.date != this.props.date) {
            this.updateTime(nextProps.date);
            this.tick();
        }
    },
    render: function () {
        return (
            <span>{this.state.date == null ? null : this.props.format.format(this.state.date)}</span>
        );
    }
});
