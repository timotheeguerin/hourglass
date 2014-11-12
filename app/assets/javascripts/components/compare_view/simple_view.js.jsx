/** @jsx React.DOM */

var SimpleView = React.createClass({
    render: function () {
        return (
            <div className="simple-view">
                <PreviewBox repository={this.props.repository} page={this.props.page}
                    revision={this.props.revision}/>
            </div>
        );
    }
});