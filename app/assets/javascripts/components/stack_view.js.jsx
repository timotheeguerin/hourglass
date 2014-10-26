/** @jsx React.DOM */


var CompareBox = React.createClass({
    getInitialState: function () {
        var left_revision_id = this.props.left === undefined ? null : this.props.left.revision_id;
        var right_revision_id = this.props.right === undefined ? null : this.props.right.revision_id;

        return {
            repository_id: this.props.repository_id,
            page: this.props.page,
            type: this.props.type,
            left: {
                revision_id: left_revision_id
            },
            right: {
                revision_id: right_revision_id
            },
            engine: null
        }
    },
    setEngine: function () {
        if (this.state.right.revision_id === undefined || this.state.right.revision_id == null) {
            this.setState({
                engine: (
                    <SimpleView repository_id={this.state.repository_id}
                        revision_id={this.state.left.revision_id}
                        page={this.state.page}>
                    </SimpleView>
                )
            });
        } else {
            this.setState({
                engine: (
                    <DualView repository_id={this.state.repository_id}
                        left={{revision_id: this.state.left.revision_id}}
                        right={{revision_id: this.state.right.revision_id}}
                        page={this.state.page}
                        type={this.state.type}>
                    </DualView>
                )
            });
        }
    },
    componentDidMount: function () {
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


var SimpleView = React.createClass({

    getInitialState: function () {
        return {
            repository_id: this.props.repository_id,
            revision_id: this.props.revision_id,
            page: this.props.page
        }
    },
    render: function () {
        return (
            <div className="simple-view">
                <iframe className="iframe" src={previewUrl(this.state, this.state.revision_id)}>
                </iframe>
            </div>
        );
    }
});

var DualView = React.createClass({

    getInitialState: function () {
        var left_revision_id = this.props.left === undefined ? null : this.props.left.revision_id;
        var right_revision_id = this.props.right === undefined ? null : this.props.right.revision_id;

        return {
            repository_id: this.props.repository_id,
            page: this.props.page,
            type: this.props.type,
            left: {
                revision_id: left_revision_id
            },
            right: {
                revision_id: right_revision_id
            }
        }
    },
    componentDidMount: function () {
        iframes = $(this.getDOMNode()).find('iframe');
        iframes_load(iframes, function () {

            link_iframes(iframes.eq(0), iframes.eq(1));
        });
    },
    render: function () {
        var slider;
        if (this.state.type == 'slide') {
            slider = (
                <div className='slider'>
                </div>
            )
        }
        return (
            <div className={this.state.type + " dual-view"}>
                <div className='left-iframe'>
                    <iframe className={this.state.type} src={previewUrl(this.state, this.state.left.revision_id)}>
                    </iframe>
                </div>
                {slider}
                <div className='right-iframe'>
                    <iframe className={this.state.type} src={previewUrl(this.state, this.state.right.revision_id)}>
                    </iframe>
                </div>
            </div>
        );
    }
});

function previewUrl(state, revision_id) {
    return Routes.preview_path(current_user, state.repository_id, revision_id, state.page)
}


function iframes_load(iframes, callback) {
    var count = iframes.length;
    iframes.load(function () {
        count--;
        if (count == 0) {
            callback();
        }
    });
}
