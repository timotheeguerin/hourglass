/** @jsx React.DOM */
//= require global

var RepositoriesBox = React.createClass({
    loadCommentsFromServer: function () {
        var url = Routes.list_user_repositories_path({user_id: this.props.user_id, enabled: true});
        $.get(url).success(function (data) {
            this.setState({repositories: data});
        }.bind(this)).fail(function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this));
    },
    getVisibleRepositories: function () {
        return this.state.repositories.filter(function (repository) {
            return repository.name.indexOf(this.state.searchText) > -1;
        }.bind(this));
    },
    getInitialState: function () {
        return {repositories: [], searchText: ''};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
    },
    navigateBack: function () {
        $(".sidebar").animate({left: '-100%'}, 350);
    },
    handleChange: function (event) {
        this.setState({searchText: event.target.value});
    },
    render: function () {
        var boundClick = this.props.onClick;
        var repositoryNodes = this.getVisibleRepositories().map(function (repository) {
            return (
                <Repository name={repository.name} id={repository.id} enabled={repository.enabled} onClick={boundClick}>
                </Repository>
            );
        });
        return (
            <div id="repositories" className="sidebar-column">
                <h2 className="sidebar-nav">
                    <span className="sidebar-title">Repositories</span>
                    <a className="sidebar-button" href="/settings">
                        <i className="fa fa-cog" ></i>
                    </a>
                </h2>
                <ol className="repositories repository-alternate sidebar-content">
                    {repositoryNodes}
                </ol>
                <div className="search-repositories">
                    <input type="search" placeholder="Search" onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
});

var Repository = React.createClass({
    toggleRepository: function (e) {
        var id = this.props.id;
        var url;
        if (e.target.checked) {
            url = Routes.enable_user_repository_path(current_user, id);
        } else {
            url = Routes.disable_user_repository_path(current_user, id);
        }

        $.post(url).done(function (data) {
        }).fail(function (xhr, status, err) {
            console.log("Failure");
            console.error(url, status, err.toString());
        });
    },
    selectRepository: function () {
        this.props.onClick(this.props.id);
    },
    render: function () {
        return (
            <li className="repository" onClick={this.selectRepository}>
                {this.props.name}
                <div class="right">
                    <i className="fa fa-angle-right fa-lg"></i>
                </div>
            </li>
        );
    }
});
