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
            this.setState(data);
        }.bind(this));
        this.view_type_change_event = EventManager.on('some', function (myarg) {
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
    getInitialState: function () {
        return ({

            slider_position: '50%'
        })
    },
    componentDidMount: function () {
        if (this.props.type == 'slide') {
            var container = $(this.refs.container.getDOMNode());
            var left_iframe = $(this.refs.left_iframe.getDOMNode());
            left_iframe.find('iframe').css({width: container.width()});
        }
        this.iframeLoading = 2;
    },
    allowDrop: function (ev) {
        ev.preventDefault();
    },
    dropLeft: function (ev) {
        ev.preventDefault();
        var revisionId = ev.dataTransfer.getData("id");
        CompareViewData.setData({left_revision_id: revisionId});
    },
    dropRight: function (ev) {
        ev.preventDefault();
        var revisionId = ev.dataTransfer.getData("id");
        CompareViewData.setData({right_revision_id: revisionId});
    },
    onMouseMove: function (e) {
        this.handleMouseMove(e.pageX);
    },
    onMouseMoveInIframe: function (positionX) {
        this.handleMouseMove(positionX);
    },
    handleMouseMove: function (positionX) {
        if (this.props.type == 'slide') {
            if (this.dragging_slider) {
                var container = $(this.refs.container.getDOMNode());
                if (!isNull(positionX) && positionX >= container.offset().left && positionX <= container.offset().left + container.width()) {
                    this.setState({slider_position: positionX - container.offset().left})
                }
            }
        }
    },
    sliderStartDragging: function () {
        this.dragging_slider = true;
    },
    sliderStopDragging: function () {
        this.dragging_slider = false;
    },
    onIframeLoaded: function () {
        this.iframeLoading--;
        if (this.iframeLoading == 0) {
            var left_iframe = $(this.refs.left_iframe.getDOMNode()).find('iframe');
            var right_iframe = $(this.refs.right_iframe.getDOMNode()).find('iframe');
            link_iframes(left_iframe, right_iframe);
        }
    },
    render: function () {
        var slider;
        if (this.props.type == 'slide') {
            slider = (
                <div className='slider' ref='slider' style={{left: this.state.slider_position}}
                    onMouseDown={this.sliderStartDragging}>
                </div>
            )
        }
        return (
            <div className={this.props.type + " dual-view"} onMouseMove={this.onMouseMove} onMouseUp={this.sliderStopDragging}
                onMouseLeave={this.sliderStopDragging} ref='container'>
                <div className='left-iframe revision-box' onDrop={this.dropLeft} onDragOver={this.allowDrop} ref='left_iframe'
                    style={{width: this.state.slider_position}} >
                    <PreviewBox repository_id={this.props.repository_id} page={this.props.page}
                        revision_id={this.props.left_revision_id} onMouseMove={this.onMouseMoveInIframe} onLoad={this.onIframeLoaded}/>
                </div>
                {slider}
                <div className='right-iframe revision-box' onDrop={this.dropRight} onDragOver={this.allowDrop} ref='right_iframe'>
                    <PreviewBox repository_id={this.props.repository_id} page={this.props.page}
                        revision_id={this.props.right_revision_id} onMouseMove={this.onMouseMoveInIframe} onLoad={this.onIframeLoaded}/>
                </div>
            </div>
        );
    }
});

var PreviewBox = React.createClass({
    getDefaultProps: function () {
        return {
            onLoad: function () {
            },
            onMouseMove: function () {
            }
        }
    },
    previewUrl: function () {
        return Routes.preview_path(current_user, this.props.repository_id, this.props.revision_id, this.props.page)
    },
    iframeLoaded: function (iframe) {
        iframe.contents().mousemove(function (e) {
            var mousePosition = e.pageX + iframe.offset().left;
            this.props.onMouseMove(mousePosition)
        }.bind(this));
    },
    componentDidMount: function () {
        if (!isNull(this.refs.iframe)) {
            var iframe = $(this.refs.iframe.getDOMNode());
            iframe.load(function () {
                this.iframeLoaded(iframe);
                this.props.onLoad(iframe);
            }.bind(this))
        }
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
                <iframe src={this.previewUrl()} ref='iframe'>
                </iframe>
            );
        }
    }
});

// Change the compare url when the compare data is changed
CompareViewData.onUpdate(function (data) {
    var params = {
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
