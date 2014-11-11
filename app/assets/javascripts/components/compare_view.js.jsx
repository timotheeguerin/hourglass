/** @jsx React.DOM */

var CompareBox = React.createClass({
    getInitialState: function () {
        return $.extend({}, this.props);
    },
    getEngine: function () {
        if (this.state.type !== 'dual') {
            return (
                <SimpleView repository={this.state.repository}
                    revision={this.state.left_revision}
                    page={this.state.page}/>
            );
        } else {
            return (
                <DualView repository={this.state.repository}
                    left_revision= {this.state.left_revision}
                    right_revision={ this.state.right_revision}
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
                <PreviewBox repository={this.props.repository} page={this.props.page}
                    revision={this.props.revision}/>
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
            slider_position: '50%',
            scrollTop: 0
        })
    },
    componentDidMount: function () {
        if (this.props.type == 'slide') {
            var container = $(this.refs.container.getDOMNode());
            var left_iframe = $(this.refs.left_iframe.getDOMNode());
            var right_iframe = $(this.refs.right_iframe.getDOMNode());
            left_iframe.find('iframe').css({width: container.width()});
            right_iframe.find('iframe').css({width: container.width()});
        }
        this.iframeLoading = 2;
    },

    allowDrop: function (ev) {
        ev.preventDefault();
    },
    dropLeft: function (ev) {
        ev.preventDefault();
        var revision = JSON.parse(ev.dataTransfer.getData("revision"));
        CompareViewData.setData({left_revision: revision});
        EventManager.trigger('dragging_revision', false);
    },
    dropRight: function (ev) {
        ev.preventDefault();
        var revision = JSON.parse(ev.dataTransfer.getData("revision"));
        CompareViewData.setData({right_revision: revision});
        EventManager.trigger('dragging_revision', false);
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
                var left_offset = container.offset().left;
                if (!isNull(positionX) && positionX >= left_offset && positionX <= left_offset + container.width()) {
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
    iframeScrolling: function (scrollTop) {
        this.setState({scrollTop: scrollTop})
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
                    style={{'flex-basis': this.state.slider_position + 'px'}} >
                    <PreviewBox repository={this.props.repository} page={this.props.page}
                        revision={this.props.left_revision} onMouseMove={this.onMouseMoveInIframe}
                        onScroll={this.iframeScrolling} scrollTop={this.state.scrollTop}/>
                </div>
                {slider}
                <div className='right-iframe revision-box' onDrop={this.dropRight} onDragOver={this.allowDrop} ref='right_iframe'>
                    <PreviewBox repository={this.props.repository} page={this.props.page}
                        revision={this.props.right_revision} onMouseMove={this.onMouseMoveInIframe}
                        onScroll={this.iframeScrolling} scrollTop={this.state.scrollTop}/>
                </div>
            </div>
        );
    }
});

var PreviewBox = React.createClass({
    getInitialState: function () {
        return ({
            dragging_revision: false
        })
    },
    getDefaultProps: function () {
        return {
            scrollTop: 0,
            onLoad: function () {
            },
            onMouseMove: function () {
            },
            onScroll: function () {
            }
        }
    },
    previewUrl: function () {
        return Routes.preview_path(current_user, this.props.repository.id, this.props.revision.id, this.props.page.path)
    },
    iframeLoaded: function (iframe) {
        iframe.contents().mousemove(function (e) {
            var mousePosition = e.pageX + iframe.offset().left;
            this.props.onMouseMove(mousePosition)
        }.bind(this));
        var props = this.props;
        $(iframe.contents()).scroll(function () {
            props.onScroll($(this).scrollTop())
        });
    },
    componentDidMount: function () {
        if (!isNull(this.refs.iframe)) {
            var iframe = $(this.refs.iframe.getDOMNode());
            iframe.load(function () {
                this.iframeLoaded(iframe);
                this.props.onLoad(iframe);
            }.bind(this))
        }
        this.dragging_listener = EventManager.on('dragging_revision', function (dragging) {
            this.setState({dragging_revision: dragging});
        }.bind(this));
    },
    componentWillReceiveProps: function (newProps) {
        this.updateIframeScroll(newProps.scrollTop)
    },
    componentWillUnmount: function () {
        this.dragging_listener.destroy();
    },
    updateIframeScroll: function (scrollTop) {
        if (!isNull(this.refs.iframe)) {
            var iframe = $(this.refs.iframe.getDOMNode());
            $(iframe.contents()).scrollTop(scrollTop);
        }
    },
    render: function () {
        var iframe;
        if (!isNull(this.props.revision)) {
            iframe = (
                <iframe src={this.previewUrl()} ref='iframe' className={this.state.dragging_revision ? 'hidden' : ''}>
                </iframe>
            );
        }
        var dragging_box;
        if (isNull(this.props.revision) || this.state.dragging_revision) {
            dragging_box = (
                <div className='drop-container'>
                    <div className="drop-description"> Drag a revision here
                    </div>
                </div>
            );
        }
        return (
            <div className='iframe-container'>
            {dragging_box}
            {iframe}
            </div>
        );
    }
});

// Change the compare url when the compare data is changed
CompareViewData.onUpdate(function (data) {
    var params = {
        user_id: current_user,
        repository_id: data.repository.id,
        page: data.page.path,
        type: data.type
    };
    if (!isNull(data.dual_type)) params.dual_type = data.dual_type;
    if (!isNull(data.left_revision)) params.left = data.left_revision.id;
    if (!isNull(data.right_revision)) params.right = data.right_revision.id;
    var url = Routes.compare_path(params);
    if (url !== document.URL) {
        window.history.pushState({}, "", url);
    }
});
