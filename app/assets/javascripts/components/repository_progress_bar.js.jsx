/** @jsx React.DOM */
var RepositoryProgressBar = React.createClass({
    getInitialState: function () {
        return {
            percent: 0
        }
    },
    componentDidMount: function () {
        this.channel = websocket.subscribe_private('repository_processing_' + this.props.repository_id);
        this.channel.bind('updated', function (data) {
            console.log(data);
            this.setState({progress: data.progress * 100})
        }.bind(this));

    },
    componentWillUnmount: function () {
        if (!isNull(this.channel)) {
            channel.unbind('repository_processing_' + this.props.repository_id);
        }
    },
    render: function () {
        return (
            <progress className="progress-bar" value={this.state.progress} max="100"></progress>
        );
    }
});