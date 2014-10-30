/** @jsx React.DOM */

var CompareBox = React.createClass({
    getEngine: function () {
        if (isNull(this.props.right)) {
            return (
                <SimpleView repository_id={this.props.repository_id}
                    revision_id={this.props.left.revision_id}
                    page={this.props.page}/>
            );
        } else {
            return (
                <DualView repository_id={this.props.repository_id}
                    left={{revision_id: this.props.left.revision_id}}
                    right={{revision_id: this.props.right.revision_id}}
                    page={this.props.page}
                    type={this.props.type}>
                </DualView>
            );
        }
    },
    render: function () {
        return (
            <div className="compare-view">
                {this.getEngine()}
            </div>
        );
    }
});


var SimpleView = React.createClass({
    render: function () {
        return (
            <div className="simple-view">
                <iframe className="iframe" src={previewUrl(this.props, this.props.revision_id)}>
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
            iframes.each(function () {
                var iframe = $(this)
                $(this).contents().mousemove(function (e) {
                    move_slider(e.pageX + iframe.offset().left);
                });
            });
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


function compare_view(repository_id, page, left_revision_id, right_revision_id, type) {
    right_revision_id = typeof right !== 'undefined' ? right : null;
    type = typeof type !== 'undefined' ? type : null;
    var url = Routes.compare_path({
        user_id: current_user,
        repository_id: repository_id,
        left_revision_id: left_revision_id,
        right_revision_Id: right_revision_id,
        page: page,
        type: type
    });
    window.history.pushState({}, "", url);
    React.renderComponent(
        <CompareBox repository_id={repository_id}
            left={{revision_id: left_revision_id}}
            right={{revision_id: right_revision_id}}
            page={page}
            type={type} />
        , document.getElementById('content')
    )
}

function isNull(o) {
    return !(typeof o !== "undefined" && o !== null)
}
