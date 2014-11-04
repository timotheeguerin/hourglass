/** @jsx React.DOM */

var CompareBox = React.createClass({
    getInitialState: function () {
        return {
            repository_id: this.props.repository_id,
            page: this.props.page,
            type: this.props.type,
            dual_type: this.dual_type,
            left_revision_id: this.props.left_revision_id,
            right_revision_id: this.props.right_revision_id
        }
    },
    getEngine: function () {
        if (this.state.type !== 'dual') {
            return (
                <SimpleView repository_id={this.state.repository_id}
                    revision_id={this.state.left_revision_id}
                    page={this.state.page}/>
            );
        } else {
            return (
                <DualView repository_id={this.state.repository_id}
                    left_revision_id= {this.state.left_revision_id}
                    right_revision_id={ this.state.right_revision_id}
                    page={this.state.page}
                    type={this.state.dual_type}>
                </DualView>
            );
        }
    },
    componentDidMount: function () {
        CompareViewData.setData(this.getInitialState());
        this.compare_view_data_event = CompareViewData.onUpdate(function (data) {
            this.setState(data);
        }.bind(this))
    },
    componentWillUnmount: function () {
        this.compare_view_data_event.destroy();
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
                <PreviewBox repository_id={this.props.repository_id} page={this.props.page}
                    revision_id={this.props.revision_id}/>
            </div>
        );
    }
});

var DualView = React.createClass({
    getDefaultProps: function () {
        return {
            type: 'split'
        }
    },
    componentDidMount: function () {
        var iframes = $(this.getDOMNode()).find('iframe');

        iframes_load(iframes, function () {
            iframes.each(function () {
                var iframe = $(this);
                $(this).contents().mousemove(function (e) {
                    move_slider(e.pageX + iframe.offset().left);
                });
            });
            link_iframes(iframes.eq(0), iframes.eq(1));
        });
    },
    render: function () {
        var slider;
        if (this.props.type == 'slide') {
            slider = (
                <div className='slider'>
                </div>
            )
        }
        return (
            <div className={this.props.type + " dual-view"}>
                <div className='left-iframe'>
                    <PreviewBox repository_id={this.props.repository_id} page={this.props.page}
                        revision_id={this.props.left_revision_id}/>
                </div>
                {slider}
                <div className='right-iframe'>
                    <PreviewBox repository_id={this.props.repository_id} page={this.props.page}
                        revision_id={this.props.right_revision_id}/>
                </div>
            </div>
        );
    }
});

var PreviewBox = React.createClass({
    previewUrl: function () {
        return Routes.preview_path(current_user, this.props.repository_id, this.props.revision_id, this.props.page)
    },
    render: function () {
        if (isNull(this.props.revision_id)) {
            return (
                <div> Drag the revision you want to see!
                </div>
            );
        } else {
            return (
                <iframe src={this.previewUrl()}>
                </iframe>
            );
        }
    }
});

//function previewUrl(state, revision_id) {
//    return Routes.preview_path(current_user, state.repository_id, revision_id, state.page)
//}


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
    right_revision_id = (isNull(right_revision_id) ? null : right_revision_id);
    type = isNull(type) ? null : type;
    var url = Routes.compare_path({
        user_id: current_user,
        repository_id: repository_id,
        left_revision_id: left_revision_id,
        right_revision_Id: right_revision_id,
        page: page,
        type: type
    });
    React.renderComponent(
        <CompareBox repository_id = {repository_id}
            left_revision_id = {left_revision_id}
            right_revision_id = {right_revision_id}
            page={page}
            type={type} />
        , document.getElementById('content')
    );
    window.history.pushState({}, "", url);

}


CompareViewData.onUpdate(function (data) {
    var url = Routes.compare_path({
        user_id: current_user,
        repository_id: data.repository_id,
        left_revision_id: data.left_revision_id,
        right_revision_Id: data.right_revision_id,
        page: data.page,
        type: data.type,
        dual_type: data.dual_type
    });
    window.history.pushState({}, "", url);
});
