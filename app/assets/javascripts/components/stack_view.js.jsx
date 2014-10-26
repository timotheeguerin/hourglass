/** @jsx React.DOM */


var CompareBox = React.createClass({
    getInitialState: function () {
        var left_revison_id = this.props.left === undefined ? null : this.props.left.revision_id;
        var right_revison_id = this.props.right === undefined ? null : this.props.right.revision_id;

        return {
            repository_id: this.props.repository_id,
            page: this.props.page,
            left: {
                revision_id: left_revison_id
            },
            right: {
                revision_id: right_revison_id
            },
            engine: null
        }
    },
    setEngine: function () {
        if (this.state.right.revision_id === undefined || this.state.right.revision_id == null) {
            this.setState({engine: (
                <SimpleCompare repository_id={this.state.repository_id}
                    revision_id={this.state.left.revision_id}
                    page={this.state.page}>
                </SimpleCompare>
            )});
        }
    },
    componentDidMount: function () {
        console.log(this.state);
        this.setEngine();
    },

    render: function () {
        return (
            <div className="compare-view">
                {this.state.engine}
            </div>
        );
    }
});


var SimpleCompare = React.createClass({

    getInitialState: function () {
        return {
            repository_id: this.props.repository_id,
            revision_id: this.props.revision_id,
            page: this.props.page
        }
    },
    render: function () {
        console.log(this.state);
        return (
            <div className="simple-view">
                <iframe className="iframe" src={previewUrl(this.state, this.state.revision_id)} style={{resize: 'horizontal'}}>
                </iframe>
            </div>
        );
    }
});

function previewUrl(state, revision_id) {
    return Routes.preview_path(current_user, state.repository_id, revision_id, state.page)
}