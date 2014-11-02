/** @jsx React.DOM */
var RepositoryProgressBar = React.createClass({
    getInitialState: function () {
        return {
            progress: 0
        }
    },
    componentDidMount: function () {
        this.channel = websocket.subscribe_private('repository_processing_' + this.props.repository_id);
        this.channel.on_success = function (current_user) {
            console.log(current_user.email + " has joined the channel");
        }.bind(this);

        this.channel.on_failure = function (reason) {
            console.log("Failed to connected for repository: " + this.props.repository_id);
            console.log(reason)
        }.bind(this);

        this.channel.bind('updated', function (data) {
            console.log(data);
            this.setState({progress: data.progress * 100})
            if (data.done) {
                this.props.onDone();
            }
        }.bind(this));

    },
    componentWillUnmount: function () {
    },
    render: function () {
        return (
            <progress className="progress-bar" value={this.state.progress} max="100"></progress>
        );
    }
});