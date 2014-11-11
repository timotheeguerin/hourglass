/** @jsx React.DOM */

var CompareBox = React.createClass({
    getInitialState: function () {
        return {
            repository_id: this.props.repository_id,
            page: this.props.page,
            type: this.props.type,
            dual_type: this.props.dual_type,
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
            console.log("CompareViewData.onUpdate");
            console.log(data);
            this.setState(data);
        }.bind(this));
        this.view_type_change_event = EventManager.on('some', function (myarg) {
            console.log('called: ' + myarg);
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.compare_view_data_event.destroy();
        this.view_type_change_event.destroy();
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
        init_sliders();
        iframes_load(iframes, function () {
            iframes.each(function () {
                var iframe = $(this);
                $(this).contents().mousemove(function (e) {
                    move_sliders(e.pageX + iframe.offset().left);
                });
            });
            link_iframes(iframes.eq(0), iframes.eq(1));
        });
    },
    allowDrop: function (ev) {
        ev.preventDefault();
    },
    dropLeft: function (ev) {
        ev.preventDefault();
        var revisionId = ev.dataTransfer.getData("id");
        console.log("Updating left revision id to: " + revisionId);
        CompareViewData.setData({left_revision_id: revisionId});
    },
    dropRight: function (ev) {
        ev.preventDefault();
        var revisionId = ev.dataTransfer.getData("id");
        console.log("Updating left revision id to: " + revisionId);
        CompareViewData.setData({right_revision_id: revisionId});
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
                <div className='left-iframe revision-box' onDrop={this.dropLeft} onDragOver={this.allowDrop}>
                    <PreviewBox repository_id={this.props.repository_id} page={this.props.page}
                        revision_id={this.props.left_revision_id}/>
                </div>
                {slider}
                <div className='right-iframe revision-box' onDrop={this.dropRight} onDragOver={this.allowDrop}>
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
                <div className='drop-container'>
                    <div className="drop-description"> Drag a revision here
                    </div>
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

function iframes_load(iframes, callback) {
    var count = iframes.length;
    iframes.load(function () {
        count--;
        if (count == 0) {
            callback();
        }
    });
}

// Change the compare url when the compare data is changed
CompareViewData.onUpdate(function (data) {
    params = {
        user_id: current_user,
        repository_id: data.repository_id,
        page: data.page,
        type: data.type
    };
    if (!isNull(data.dual_type)) params.dual_type = data.dual_type;
    if (!isNull(data.left_revision_id)) params.left = data.left_revision_id;
    if (!isNull(data.right_revision_id)) params.right = data.right_revision_id;
    var url = Routes.compare_path(params);
    window.history.pushState({}, "", url);
});
