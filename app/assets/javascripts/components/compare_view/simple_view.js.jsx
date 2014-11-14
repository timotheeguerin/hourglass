/** @jsx React.DOM */

var SimpleView = React.createClass({
    onRevisionSelected: function (revision) {
        CompareViewData.setData({left_revision: revision})
    },
    render: function () {
        return (
            <div className="simple-view">
                <PreviewBox repository={this.props.repository} page={this.props.page}
                    revision={this.props.revision} onRevisionSelected={this.onRevisionSelected}/>
            </div>
        );
    }
});